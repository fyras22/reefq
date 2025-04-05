import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { 
  saveDesignToSupabase, 
  getUserDesignsFromSupabase,
  getPopularDesignsFromSupabase
} from '@/services/supabaseCustomizationService';

// Validate design input
const designSchema = z.object({
  name: z.string().min(1).max(100),
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
  }),
  previewImage: z.string().url(),
  price: z.number().positive(),
  isPublic: z.boolean()
});

// Handler for GET requests to list designs
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  try {
    // Return popular designs
    if (type === 'popular') {
      const designs = await getPopularDesignsFromSupabase();
      return NextResponse.json(designs);
    }
    
    // User must be authenticated to get their designs
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's designs
    const userId = token.sub;
    const designs = await getUserDesignsFromSupabase(userId!);
    
    return NextResponse.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 });
  }
}

// Handler for POST requests to create a new design
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  
  try {
    // Parse and validate request body
    const body = await request.json();
    const parsedData = designSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsedData.error.format() },
        { status: 400 }
      );
    }
    
    // Get user ID if authenticated
    const userId = token?.sub;
    
    // Save design
    const design = await saveDesignToSupabase(parsedData.data, userId);
    
    if (!design) {
      return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
    }
    
    return NextResponse.json(design, { status: 201 });
  } catch (error) {
    console.error('Error creating design:', error);
    return NextResponse.json({ error: 'Failed to create design' }, { status: 500 });
  }
} 