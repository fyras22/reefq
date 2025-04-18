import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = 'force-dynamic';

// Mock data for fallback
const mockJewelryData = [
  {
    id: 1,
    name: 'Diamond Ring',
    description: 'Beautiful diamond ring with gold band',
    price: 999.99,
    category: 'rings',
    image: '/images/jewelry/diamond-ring.jpg',
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: 'Pearl Necklace',
    description: 'Elegant pearl necklace with silver clasp',
    price: 599.99,
    category: 'necklaces',
    image: '/images/jewelry/pearl-necklace.jpg',
    rating: 4.6,
    inStock: true
  },
  {
    id: 3,
    name: 'Gold Bracelet',
    description: 'Stunning gold bracelet with intricate design',
    price: 799.99,
    category: 'bracelets',
    image: '/images/jewelry/gold-bracelet.jpg',
    rating: 4.7,
    inStock: true
  },
  {
    id: 4,
    name: 'Sapphire Earrings',
    description: 'Beautiful sapphire earrings with diamond accents',
    price: 1299.99,
    category: 'earrings',
    image: '/images/jewelry/sapphire-earrings.jpg',
    rating: 4.9,
    inStock: true
  },
  {
    id: 5,
    name: 'Emerald Ring',
    description: 'Stunning emerald ring with platinum band',
    price: 1499.99,
    category: 'rings',
    image: '/images/jewelry/emerald-ring.jpg',
    rating: 4.7,
    inStock: false
  },
  {
    id: 6,
    name: 'Ruby Pendant',
    description: 'Exquisite ruby pendant with gold chain',
    price: 899.99,
    category: 'necklaces',
    image: '/images/jewelry/ruby-pendant.jpg',
    rating: 4.5,
    inStock: true
  },
  {
    id: 7,
    name: 'Silver Anklet',
    description: 'Delicate silver anklet with small charms',
    price: 299.99,
    category: 'anklets',
    image: '/images/jewelry/silver-anklet.jpg',
    rating: 4.3,
    inStock: true
  },
  {
    id: 8,
    name: 'Diamond Tennis Bracelet',
    description: 'Classic diamond tennis bracelet in white gold',
    price: 2999.99,
    category: 'bracelets',
    image: '/images/jewelry/diamond-bracelet.jpg',
    rating: 4.9,
    inStock: true
  }
];

export async function GET(request: Request) {
  try {
    // For now, simply return the mock data to ensure static compatibility
    return NextResponse.json({ data: mockJewelryData });
  } catch (error) {
    console.error('Error in jewelry API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 