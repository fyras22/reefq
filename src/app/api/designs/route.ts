import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt'; // Remove unused NextAuth import
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  saveDesignToSupabase,
  getUserDesignsFromSupabase,
  getPopularDesignsFromSupabase
} from '@/services/supabaseCustomizationService';
// import { CustomDesignSchema } from '@/schemas/designSchema'; // Schema not found, defining basic one below
import type { CustomDesign, CustomizationSettings } from '@/services/customizationService'; // Adjust path if needed

// Define a more specific Zod schema for Customization Settings
const CustomizationSettingsSchema = z.object({
  productType: z.string(),
  designStyle: z.string(),
  metal: z.string(),
  gemstone: z.string().nullable().optional(),
  gemCount: z.number().int().positive().optional(),
  size: z.number().nullable().optional(),
  engravingText: z.string().optional(),
  culturalStyle: z.string().optional(),
  chainStyle: z.string().optional(),
  backingStyle: z.string().optional(),
  giftWrapping: z.boolean().optional()
});

// Define the main schema using the detailed settings schema
const CustomDesignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  settings: CustomizationSettingsSchema, // Use the detailed settings schema
  previewImage: z.string().url("Preview image must be a valid URL").optional(),
  price: z.number().positive("Price must be a positive number"),
  isPublic: z.boolean().optional().default(false),
  // Note: id and createdAt are excluded as they are generated server-side
});

// Type assertion for the data passed to the service function
type DesignInputData = Omit<CustomDesign, 'id' | 'createdAt'>;

// GET handler for fetching designs
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  try {
    let designs;
    if (type === 'user') {
      if (!userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }
      designs = await getUserDesignsFromSupabase(supabase, userId);
    } else {
      designs = await getPopularDesignsFromSupabase(supabase);
    }
    return NextResponse.json(designs);
  } catch (error: any) {
    console.error('[API Designs GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch designs', details: error.message }, { status: 500 });
  }
}

// POST handler for saving a new design
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const jsonData = await request.json();
    const parsedData = CustomDesignSchema.safeParse(jsonData);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid design data', details: parsedData.error.errors }, { status: 400 });
    }

    // Explicitly cast the validated data to the expected type for the service function
    const designInput: DesignInputData = parsedData.data as DesignInputData;

    const design = await saveDesignToSupabase(supabase, designInput, userId);

    if (!design) {
      return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
    }

    return NextResponse.json(design, { status: 201 });
  } catch (error: any) {
    console.error('[API Designs POST Error]:', error);
    return NextResponse.json({ error: 'Failed to save design', details: error.message }, { status: 500 });
  }
} 