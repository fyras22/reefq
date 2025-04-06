import { useState, useEffect, useCallback } from 'react';
// import { useSession } from 'next-auth/react'; // Remove NextAuth import
import { useAuth } from '@/providers/AuthProvider'; // Import the new useAuth hook
import {
  CustomizationSettings,
  CustomDesign,
  calculatePrice,
  // remove unused imports from customizationService if they were only for non-Supabase fallback
  // getUserDesigns, // Likely unused now
  // deleteUserDesign, // Likely unused now
  // getRecommendationsByOccasion, // Stubbed out later
  // getRecommendationsByBudget // Stubbed out later
} from '@/services/customizationService';
// Remove imports for supabaseCustomizationService
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
  updateCurrentDesign: (designId: string, updates: Partial<Omit<CustomDesign, 'id' | 'createdAt'>>) => Promise<boolean>;
  deleteCurrentDesign: (designId: string) => Promise<boolean>;
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
  const { user } = useAuth();
  const userId = user?.id;
  
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
        setError(null);
        try {
          const response = await fetch(`/api/designs/${options.designId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
          const design: CustomDesign = await response.json();

          if (design) {
            setSettings(design.settings);
            setDesignPreviewURL(design.previewImage);
          } else {
            setError('Design not found');
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load design');
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
      if (!userId) {
        setSavedDesigns([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/designs?type=user`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const designs: CustomDesign[] = await response.json();
        setSavedDesigns(designs);
      } catch (err: any) {
        setError(err.message || 'Failed to load saved designs');
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
    setModelPath('');
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
    if (!userId) {
      setError('You must be logged in to save designs.');
      return null;
    }
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
      
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const savedDesign: CustomDesign = await response.json();

      setSavedDesigns(prev => [...prev, savedDesign]);
      options.onSaveComplete?.(savedDesign);
      return savedDesign;
    } catch (error) {
      console.error('Error saving design:', error);
      setError('An error occurred while saving your design');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, settings, currentPrice, designPreviewURL, options.onSaveComplete]);

  // Apply occasion recommendation
  const applyOccasionRecommendation = useCallback((occasion: string) => {
    console.log('Applying recommendations for occasion:', occasion);
  }, []);

  // Apply budget recommendation
  const applyBudgetRecommendation = useCallback((budget: number) => {
    console.log('Applying recommendations for budget:', budget);
  }, []);

  // Check if a design is in wishlist
  const isInWishlist = useCallback((designId: string) => {
    return wishlistItems.includes(designId);
  }, [wishlistItems]);

  // Toggle wishlist item
  const toggleWishlist = useCallback((designId: string) => {
    setWishlistItems(prev => {
      const newWishlist = prev.includes(designId)
        ? prev.filter(id => id !== designId)
        : [...prev, designId];
      localStorage.setItem('jewelry_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  }, []);

  // Save screenshot as preview
  const takeScreenshot = useCallback((dataUrl: string) => {
    setDesignPreviewURL(dataUrl);
    console.log('Screenshot taken and set as preview URL');
  }, []);

  // Update design
  const updateCurrentDesign = useCallback(async (designId: string, updates: Partial<Omit<CustomDesign, 'id' | 'createdAt'>>) => {
    if (!userId) {
      setError('You must be logged in to update designs.');
      return false;
    }
    if (!designId) {
      setError('Design ID is missing for update.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedDesign: CustomDesign = await response.json();

      setSavedDesigns(prev => prev.map(d => d.id === designId ? updatedDesign : d));
      if (options.designId === designId) {
        setSettings(updatedDesign.settings);
        setDesignPreviewURL(updatedDesign.previewImage);
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update design');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, options.designId]);

  // Delete a design
  const deleteCurrentDesign = useCallback(async (designId: string) => {
    if (!userId) {
      setError('You must be logged in to delete designs.');
      return false;
    }
    if (!designId) {
      setError('Design ID is missing for delete.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Design ${designId} not found for deletion.`);
          setSavedDesigns(prev => prev.filter(d => d.id !== designId));
          return true;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
      }

      setSavedDesigns(prev => prev.filter(d => d.id !== designId));
      if (options.designId === designId) {
        resetSettings();
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete design');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, options.designId, resetSettings]);

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
    updateCurrentDesign,
    deleteCurrentDesign,
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