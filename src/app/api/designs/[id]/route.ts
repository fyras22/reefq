import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt'; // Remove unused NextAuth import
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  getDesignByIdFromSupabase,
  updateDesignInSupabase,
  deleteDesignFromSupabase,
  incrementDesignViewCount
} from '@/services/supabaseCustomizationService';
// Import the type if needed
import type { CustomDesign, CustomizationSettings } from '@/services/customizationService'; // Adjust path if needed

// Define basic Zod schemas if needed for PUT/PATCH validation
const CustomizationSettingsUpdateSchema = z.object({
  productType: z.string().optional(),
  designStyle: z.string().optional(),
  metal: z.string().optional(),
  gemstone: z.string().nullable().optional(),
  gemCount: z.number().int().positive().optional(),
  size: z.number().nullable().optional(),
  engravingText: z.string().optional(),
  culturalStyle: z.string().optional(),
  chainStyle: z.string().optional(),
  backingStyle: z.string().optional(),
  giftWrapping: z.boolean().optional()
}).partial(); // Allow partial updates

const CustomDesignUpdateSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  settings: CustomizationSettingsUpdateSchema.optional(),
  previewImage: z.string().url("Preview image must be a valid URL").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  isPublic: z.boolean().optional(),
}).partial(); // Allow partial updates

// Type needed for casting the update payload
type DesignUpdatePayload = Partial<Omit<CustomDesign, 'id' | 'createdAt'>>;

interface RouteParams { params: { id: string } }

// GET handler for fetching a single design by ID
export async function GET(request: Request, { params }: RouteParams) {
  const supabase = createClient();
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Design ID is required' }, { status: 400 });
  }

  try {
    // Increment view count (fire and forget)
    incrementDesignViewCount(supabase, id).catch(err => {
      console.warn(`Failed to increment view count for design ${id}:`, err);
    });

    const design = await getDesignByIdFromSupabase(supabase, id);

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }
    return NextResponse.json(design);
  } catch (error: any) {
    console.error(`[API Design ID GET Error ${id}]:`, error);
    return NextResponse.json({ error: 'Failed to fetch design', details: error.message }, { status: 500 });
  }
}

// PUT/PATCH handler for updating a design
export async function PUT(request: Request, { params }: RouteParams) {
  const supabase = createClient();
  const { id } = params;
  const { data: { user } } = await supabase.auth.getUser();

  if (!id) {
    return NextResponse.json({ error: 'Design ID is required' }, { status: 400 });
  }
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch the existing design to check ownership
    const existingDesign = await getDesignByIdFromSupabase(supabase, id);
    if (!existingDesign) {
        return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    // *** TODO: Implement proper ownership check ***
    // This requires knowing how user ID is associated with designs in your DB
    // Example: if (existingDesign.user_id !== user.id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const jsonData = await request.json();
    // Validate incoming update data
    const parsedData = CustomDesignUpdateSchema.safeParse(jsonData);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid update data', details: parsedData.error.errors }, { status: 400 });
    }

    // Cast the validated data to the type expected by the service function.
    // This assumes the service function can handle partial updates gracefully.
    const updatePayload = parsedData.data as DesignUpdatePayload;

    const updated = await updateDesignInSupabase(supabase, id, updatePayload);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
    }

    // Fetch the updated design to return it
    const updatedDesign = await getDesignByIdFromSupabase(supabase, id);
    return NextResponse.json(updatedDesign);

  } catch (error: any) {
    console.error(`[API Design ID PUT Error ${id}]:`, error);
    return NextResponse.json({ error: 'Failed to update design', details: error.message }, { status: 500 });
  }
}

// DELETE handler for deleting a design
export async function DELETE(request: Request, { params }: RouteParams) {
  const supabase = createClient();
  const { id } = params;
  const { data: { user } } = await supabase.auth.getUser();

  if (!id) {
    return NextResponse.json({ error: 'Design ID is required' }, { status: 400 });
  }
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch the existing design to check ownership
    const existingDesign = await getDesignByIdFromSupabase(supabase, id);
    if (!existingDesign) {
      // Already deleted or never existed, treat as success (idempotent)
      return NextResponse.json({ message: 'Design not found or already deleted' }, { status: 200 });
    }

    // *** TODO: Implement proper ownership check ***
    // Example: if (existingDesign.user_id !== user.id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const deleted = await deleteDesignFromSupabase(supabase, id);

    if (!deleted) {
      // This might happen if the delete function itself fails internally
      return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Design deleted successfully' }, { status: 200 }); // Or 204 No Content

  } catch (error: any) {
    console.error(`[API Design ID DELETE Error ${id}]:`, error);
    return NextResponse.json({ error: 'Failed to delete design', details: error.message }, { status: 500 });
  }
} 