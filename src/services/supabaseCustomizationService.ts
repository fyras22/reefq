import { createClient } from '@supabase/supabase-js';
import { CustomizationSettings, CustomDesign } from './customizationService';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Database tables
const DESIGNS_TABLE = 'jewelry_designs';
const SETTINGS_TABLE = 'customization_settings';

// Type definitions
interface SupabaseCustomDesign extends Omit<CustomDesign, 'settings' | 'createdAt'> {
  settings_id: string;
  created_at: string;
  user_id: string | null;
  preview_image: string; // Snake case for DB columns
  is_public: boolean;    // Snake case for DB columns
}

// Save a design to Supabase
export async function saveDesignToSupabase(
  design: Omit<CustomDesign, 'id' | 'createdAt'>, 
  userId?: string
): Promise<CustomDesign | null> {
  try {
    // First, insert the settings
    const { data: settingsData, error: settingsError } = await supabase
      .from(SETTINGS_TABLE)
      .insert([design.settings])
      .select('id')
      .single();

    if (settingsError || !settingsData) {
      console.error('Error saving settings:', settingsError);
      return null;
    }

    // Then insert the design with reference to settings
    const { data: designData, error: designError } = await supabase
      .from(DESIGNS_TABLE)
      .insert([{
        name: design.name,
        settings_id: settingsData.id,
        preview_image: design.previewImage,
        price: design.price,
        is_public: design.isPublic,
        user_id: userId || null
      }])
      .select('*, settings:settings_id(*)')
      .single();

    if (designError || !designData) {
      console.error('Error saving design:', designError);
      return null;
    }

    // Map the response to our CustomDesign format
    return {
      id: designData.id,
      name: designData.name,
      settings: designData.settings as CustomizationSettings,
      previewImage: designData.preview_image,
      createdAt: new Date(designData.created_at),
      price: designData.price,
      isPublic: designData.is_public
    };
  } catch (error) {
    console.error('Error in saveDesignToSupabase:', error);
    return null;
  }
}

// Get user's designs from Supabase
export async function getUserDesignsFromSupabase(userId: string): Promise<CustomDesign[]> {
  try {
    const { data, error } = await supabase
      .from(DESIGNS_TABLE)
      .select('*, settings:settings_id(*)')
      .eq('user_id', userId);

    if (error || !data) {
      console.error('Error fetching user designs:', error);
      return [];
    }

    // Map the response to our CustomDesign format
    return data.map(design => ({
      id: design.id,
      name: design.name,
      settings: design.settings as CustomizationSettings,
      previewImage: design.preview_image,
      createdAt: new Date(design.created_at),
      price: design.price,
      isPublic: design.is_public
    }));
  } catch (error) {
    console.error('Error in getUserDesignsFromSupabase:', error);
    return [];
  }
}

// Get popular designs from Supabase
export async function getPopularDesignsFromSupabase(): Promise<CustomDesign[]> {
  try {
    const { data, error } = await supabase
      .from(DESIGNS_TABLE)
      .select('*, settings:settings_id(*)')
      .eq('is_public', true)
      .order('view_count', { ascending: false })
      .limit(10);

    if (error || !data) {
      console.error('Error fetching popular designs:', error);
      return [];
    }

    // Map the response to our CustomDesign format
    return data.map(design => ({
      id: design.id,
      name: design.name,
      settings: design.settings as CustomizationSettings,
      previewImage: design.preview_image,
      createdAt: new Date(design.created_at),
      price: design.price,
      isPublic: design.is_public
    }));
  } catch (error) {
    console.error('Error in getPopularDesignsFromSupabase:', error);
    return [];
  }
}

// Delete a design from Supabase
export async function deleteDesignFromSupabase(designId: string): Promise<boolean> {
  try {
    // Get the settings ID first
    const { data: designData, error: fetchError } = await supabase
      .from(DESIGNS_TABLE)
      .select('settings_id')
      .eq('id', designId)
      .single();

    if (fetchError || !designData) {
      console.error('Error fetching design to delete:', fetchError);
      return false;
    }

    // Delete the design
    const { error: designError } = await supabase
      .from(DESIGNS_TABLE)
      .delete()
      .eq('id', designId);

    if (designError) {
      console.error('Error deleting design:', designError);
      return false;
    }

    // Delete the associated settings
    const { error: settingsError } = await supabase
      .from(SETTINGS_TABLE)
      .delete()
      .eq('id', designData.settings_id);

    if (settingsError) {
      console.error('Error deleting settings:', settingsError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteDesignFromSupabase:', error);
    return false;
  }
}

// Update a design in Supabase
export async function updateDesignInSupabase(
  designId: string, 
  updates: Partial<Omit<CustomDesign, 'id' | 'createdAt'>>
): Promise<boolean> {
  try {
    // If settings are being updated
    if (updates.settings) {
      // Get the settings ID
      const { data: designData, error: fetchError } = await supabase
        .from(DESIGNS_TABLE)
        .select('settings_id')
        .eq('id', designId)
        .single();

      if (fetchError || !designData) {
        console.error('Error fetching design to update settings:', fetchError);
        return false;
      }

      // Update the settings
      const { error: settingsError } = await supabase
        .from(SETTINGS_TABLE)
        .update(updates.settings)
        .eq('id', designData.settings_id);

      if (settingsError) {
        console.error('Error updating settings:', settingsError);
        return false;
      }
    }

    // Prepare design updates without settings
    const designUpdates: Partial<SupabaseCustomDesign> = {};
    
    if (updates.name) designUpdates.name = updates.name;
    if (updates.previewImage) designUpdates.preview_image = updates.previewImage;
    if (updates.price !== undefined) designUpdates.price = updates.price;
    if (updates.isPublic !== undefined) designUpdates.is_public = updates.isPublic;

    // Update the design if we have updates
    if (Object.keys(designUpdates).length > 0) {
      const { error: designError } = await supabase
        .from(DESIGNS_TABLE)
        .update(designUpdates)
        .eq('id', designId);

      if (designError) {
        console.error('Error updating design:', designError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in updateDesignInSupabase:', error);
    return false;
  }
}

// Get design by ID from Supabase
export async function getDesignByIdFromSupabase(designId: string): Promise<CustomDesign | null> {
  try {
    const { data, error } = await supabase
      .from(DESIGNS_TABLE)
      .select('*, settings:settings_id(*)')
      .eq('id', designId)
      .single();

    if (error || !data) {
      console.error('Error fetching design by ID:', error);
      return null;
    }

    // Map the response to our CustomDesign format
    return {
      id: data.id,
      name: data.name,
      settings: data.settings as CustomizationSettings,
      previewImage: data.preview_image,
      createdAt: new Date(data.created_at),
      price: data.price,
      isPublic: data.is_public
    };
  } catch (error) {
    console.error('Error in getDesignByIdFromSupabase:', error);
    return null;
  }
}

// Increment view count for a design
export async function incrementDesignViewCount(designId: string): Promise<void> {
  try {
    await supabase.rpc('increment_design_view_count', { design_id: designId });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

// Search designs by keyword
export async function searchDesigns(
  query: string, 
  onlyPublic: boolean = true
): Promise<CustomDesign[]> {
  try {
    let queryBuilder = supabase
      .from(DESIGNS_TABLE)
      .select('*, settings:settings_id(*)');
    
    if (onlyPublic) {
      queryBuilder = queryBuilder.eq('is_public', true);
    }
    
    // Search in name field and settings table
    const { data, error } = await queryBuilder
      .or(`name.ilike.%${query}%, settings.product_type.ilike.%${query}%, settings.design_style.ilike.%${query}%, settings.cultural_style.ilike.%${query}%`)
      .order('view_count', { ascending: false });

    if (error || !data) {
      console.error('Error searching designs:', error);
      return [];
    }

    // Map the response to our CustomDesign format
    return data.map(design => ({
      id: design.id,
      name: design.name,
      settings: design.settings as CustomizationSettings,
      previewImage: design.preview_image,
      createdAt: new Date(design.created_at),
      price: design.price,
      isPublic: design.is_public
    }));
  } catch (error) {
    console.error('Error in searchDesigns:', error);
    return [];
  }
}

// Get recent designs by specific type or style
export async function getDesignsByAttribute(
  attribute: 'productType' | 'designStyle' | 'culturalStyle' | 'metal' | 'gemstone',
  value: string,
  limit: number = 6
): Promise<CustomDesign[]> {
  // Convert our attribute to the database column name
  const dbMapping: Record<string, string> = {
    productType: 'product_type',
    designStyle: 'design_style',
    culturalStyle: 'cultural_style',
    metal: 'metal',
    gemstone: 'gemstone'
  };
  
  const dbAttribute = dbMapping[attribute];
  
  try {
    const { data, error } = await supabase
      .from(DESIGNS_TABLE)
      .select('*, settings:settings_id(*)')
      .eq('is_public', true)
      .eq(`settings.${dbAttribute}`, value)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error(`Error fetching designs by ${attribute}:`, error);
      return [];
    }

    // Map the response to our CustomDesign format
    return data.map(design => ({
      id: design.id,
      name: design.name,
      settings: design.settings as CustomizationSettings,
      previewImage: design.preview_image,
      createdAt: new Date(design.created_at),
      price: design.price,
      isPublic: design.is_public
    }));
  } catch (error) {
    console.error(`Error in getDesignsByAttribute for ${attribute}:`, error);
    return [];
  }
} 