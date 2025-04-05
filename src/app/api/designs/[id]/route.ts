import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { 
  getDesignByIdFromSupabase,
  updateDesignInSupabase,
  deleteDesignFromSupabase,
  incrementDesignViewCount
} from '@/services/supabaseCustomizationService';

// Validate update input
const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  settings: z.object({
    productType: z.string(),
    designStyle: z.string(),
    metal: z.string(),
    gemstone: z.string().nullable(),
    gemCount: z.number().int().positive(),
    size: z.number().nullable(),
    engravingText: z.string(),
    culturalStyle: z.string(),
    chainStyle: z.string().optional(),
    backingStyle: z.string().optional(),
    giftWrapping: z.boolean()
  }).optional(),
  previewImage: z.string().url().optional(),
  price: z.number().positive().optional(),
  isPublic: z.boolean().optional()
});

// Handler for GET requests to fetch a single design
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Increment view count in background
    incrementDesignViewCount(id).catch(err => {
      console.error('Error incrementing view count:', err);
    });
    
    // Get design
    const design = await getDesignByIdFromSupabase(id);
    
    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }
    
    return NextResponse.json(design);
  } catch (error) {
    console.error('Error fetching design:', error);
    return NextResponse.json({ error: 'Failed to fetch design' }, { status: 500 });
  }
}

// Handler for PUT requests to update a design
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    // Get current design to check ownership
    const existingDesign = await getDesignByIdFromSupabase(id);
    
    if (!existingDesign) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }
    
    // Check ownership if design has a user ID
    if (existingDesign.userId && existingDesign.userId !== token.sub) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const parsedData = updateSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsedData.error.format() },
        { status: 400 }
      );
    }
    
    // Update design
    const updated = await updateDesignInSupabase(id, parsedData.data);
    
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
    }
    
    // Get updated design
    const updatedDesign = await getDesignByIdFromSupabase(id);
    
    return NextResponse.json(updatedDesign);
  } catch (error) {
    console.error('Error updating design:', error);
    return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
  }
}

// Handler for DELETE requests to delete a design
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    // Get current design to check ownership
    const existingDesign = await getDesignByIdFromSupabase(id);
    
    if (!existingDesign) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }
    
    // Check ownership if design has a user ID
    if (existingDesign.userId && existingDesign.userId !== token.sub) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Delete design
    const deleted = await deleteDesignFromSupabase(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting design:', error);
    return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
  }
} 