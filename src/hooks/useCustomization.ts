import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  CustomizationSettings, 
  CustomDesign,
  calculatePrice,
  saveUserDesign,
  getUserDesigns,
  deleteUserDesign,
  getRecommendationsByOccasion,
  getRecommendationsByBudget
} from '@/services/customizationService';
import {
  saveDesignToSupabase,
  getUserDesignsFromSupabase,
  deleteDesignFromSupabase,
  updateDesignInSupabase,
  getDesignByIdFromSupabase
} from '@/services/supabaseCustomizationService';
import { MetalType, GemstoneType } from '@/data/materialsData';

// Default customization settings
const defaultSettings: CustomizationSettings = {
  productType: 'ring',
  designStyle: 'solitaire',
  metal: 'gold',
  gemstone: 'diamond',
  gemCount: 1,
  size: 7,
  engravingText: '',
  culturalStyle: 'default',
  giftWrapping: false
};

export type CustomizationStep = 'product' | 'design' | 'materials' | 'details' | 'review';

export interface UseCustomizationOptions {
  initialSettings?: Partial<CustomizationSettings>;
  designId?: string; // For editing existing designs
  onSaveComplete?: (design: CustomDesign) => void;
}

export interface UseCustomizationReturn {
  settings: CustomizationSettings;
  updateSetting: <K extends keyof CustomizationSettings>(key: K, value: CustomizationSettings[K]) => void;
  updateMultipleSettings: (updates: Partial<CustomizationSettings>) => void;
  resetSettings: () => void;
  currentPrice: number;
  currentStep: CustomizationStep;
  setStep: (step: CustomizationStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: () => boolean;
  saveCurrentDesign: (name: string, makePublic?: boolean) => Promise<CustomDesign | null>;
  savedDesigns: CustomDesign[];
  isLoading: boolean;
  error: string | null;
  applyOccasionRecommendation: (occasion: string) => void;
  applyBudgetRecommendation: (budget: number) => void;
  isInWishlist: (designId: string) => boolean;
  toggleWishlist: (designId: string) => void;
  wishlistItems: string[];
  designPreviewURL: string;
  modelPath: string;
  takeScreenshot: (dataUrl: string) => void;
}

export function useCustomization(options: UseCustomizationOptions = {}): UseCustomizationReturn {
  const { data: session } = useSession();
  const userId = session?.user?.id as string | undefined;
  
  // State
  const [settings, setSettings] = useState<CustomizationSettings>({
    ...defaultSettings,
    ...options.initialSettings
  });
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<CustomizationStep>('product');
  const [savedDesigns, setSavedDesigns] = useState<CustomDesign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [designPreviewURL, setDesignPreviewURL] = useState<string>('');
  const [modelPath, setModelPath] = useState<string>('');

  // Load existing design if designId is provided
  useEffect(() => {
    if (options.designId) {
      const loadDesign = async () => {
        setIsLoading(true);
        try {
          const design = await getDesignByIdFromSupabase(options.designId!);
          if (design) {
            setSettings(design.settings);
            setDesignPreviewURL(design.previewImage);
          } else {
            setError('Design not found');
          }
        } catch (err) {
          setError('Failed to load design');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadDesign();
    }
  }, [options.designId]);

  // Load saved designs
  useEffect(() => {
    const loadDesigns = async () => {
      setIsLoading(true);
      try {
        let designs: CustomDesign[] = [];
        
        if (userId) {
          // If logged in, load from Supabase
          designs = await getUserDesignsFromSupabase(userId);
        } else {
          // Otherwise load from localStorage
          designs = getUserDesigns();
        }
        
        setSavedDesigns(designs);
      } catch (err) {
        console.error('Error loading designs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDesigns();
  }, [userId]);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWishlist = localStorage.getItem('jewelry_wishlist');
      if (storedWishlist) {
        try {
          setWishlistItems(JSON.parse(storedWishlist));
        } catch (err) {
          console.error('Error parsing wishlist:', err);
        }
      }
    }
  }, []);

  // Update price when settings change
  useEffect(() => {
    setCurrentPrice(calculatePrice(settings));
    
    // Update model path based on selected options
    const productType = settings.productType.toLowerCase();
    const metal = settings.metal.toLowerCase();
    const style = settings.designStyle.toLowerCase();
    
    // Example path structure, adjust according to your actual model naming convention
    const newModelPath = `/models/${productType}/${style}-${metal}.glb`;
    setModelPath(newModelPath);
  }, [settings]);

  // Update a single setting
  const updateSetting = useCallback(<K extends keyof CustomizationSettings>(
    key: K, 
    value: CustomizationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple settings at once
  const updateMultipleSettings = useCallback((updates: Partial<CustomizationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset to default settings
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    setDesignPreviewURL('');
  }, []);

  // Navigation functions
  const setStep = useCallback((step: CustomizationStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    const steps: CustomizationStep[] = ['product', 'design', 'materials', 'details', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const steps: CustomizationStep[] = ['product', 'design', 'materials', 'details', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  // Check if can proceed to next step
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'product':
        return !!settings.productType;
      case 'design':
        return !!settings.designStyle;
      case 'materials':
        return !!settings.metal && (settings.gemstone !== null);
      case 'details':
        return settings.productType === 'ring' ? settings.size !== null : true;
      case 'review':
        return true;
      default:
        return true;
    }
  }, [currentStep, settings]);

  // Save the current design
  const saveCurrentDesign = useCallback(async (
    name: string, 
    makePublic: boolean = false
  ): Promise<CustomDesign | null> => {
    if (!name.trim()) {
      setError('Please provide a name for your design');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const designToSave: Omit<CustomDesign, 'id' | 'createdAt'> = {
        name,
        settings,
        previewImage: designPreviewURL || '/images/default-design-preview.jpg',
        price: currentPrice,
        isPublic: makePublic
      };
      
      let savedDesign: CustomDesign | null = null;
      
      if (userId) {
        // Save to Supabase if logged in
        savedDesign = await saveDesignToSupabase(designToSave, userId);
      } else {
        // Save to localStorage if not logged in
        savedDesign = saveUserDesign(designToSave);
      }
      
      if (savedDesign) {
        setSavedDesigns(prev => [savedDesign!, ...prev]);
        
        if (options.onSaveComplete) {
          options.onSaveComplete(savedDesign);
        }
        
        return savedDesign;
      } else {
        setError('Failed to save design');
        return null;
      }
    } catch (error) {
      console.error('Error saving design:', error);
      setError('An error occurred while saving your design');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [settings, currentPrice, designPreviewURL, userId, options.onSaveComplete]);

  // Apply occasion recommendation
  const applyOccasionRecommendation = useCallback((occasion: string) => {
    const recommendation = getRecommendationsByOccasion(occasion);
    if (recommendation) {
      updateMultipleSettings(recommendation);
    }
  }, [updateMultipleSettings]);

  // Apply budget recommendation
  const applyBudgetRecommendation = useCallback((budget: number) => {
    const recommendation = getRecommendationsByBudget(budget);
    if (recommendation) {
      updateMultipleSettings(recommendation);
    }
  }, [updateMultipleSettings]);

  // Check if a design is in wishlist
  const isInWishlist = useCallback((designId: string) => {
    return wishlistItems.includes(designId);
  }, [wishlistItems]);

  // Toggle wishlist item
  const toggleWishlist = useCallback((designId: string) => {
    let newWishlist: string[];
    
    if (wishlistItems.includes(designId)) {
      newWishlist = wishlistItems.filter(id => id !== designId);
    } else {
      newWishlist = [...wishlistItems, designId];
    }
    
    setWishlistItems(newWishlist);
    localStorage.setItem('jewelry_wishlist', JSON.stringify(newWishlist));
  }, [wishlistItems]);

  // Save screenshot as preview
  const takeScreenshot = useCallback((dataUrl: string) => {
    setDesignPreviewURL(dataUrl);
  }, []);

  return {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    currentPrice,
    currentStep,
    setStep,
    nextStep,
    prevStep,
    canProceed,
    saveCurrentDesign,
    savedDesigns,
    isLoading,
    error,
    applyOccasionRecommendation,
    applyBudgetRecommendation,
    isInWishlist,
    toggleWishlist,
    wishlistItems,
    designPreviewURL,
    modelPath,
    takeScreenshot
  };
} 