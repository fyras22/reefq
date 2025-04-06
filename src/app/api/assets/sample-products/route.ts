import { NextRequest, NextResponse } from 'next/server';

// Set to force dynamic to avoid static site generation errors
export const dynamic = 'force-dynamic';

// Simple mock API
export async function GET(request: NextRequest) {
  const mockProducts = [
    {
      id: "ring-diamond-solitaire",
      name: "Diamond Solitaire Ring",
      category: "rings",
      price: 3499.99
    },
    {
      id: "necklace-sapphire-pendant",
      name: "Sapphire Pendant Necklace",
      category: "necklaces",
      price: 1299.99
    }
  ];
  
  return NextResponse.json({
    products: mockProducts,
    pagination: {
      total: 2,
      limit: 10,
      offset: 0,
      hasMore: false
    }
  });
} 