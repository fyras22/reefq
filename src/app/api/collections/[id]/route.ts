import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  
  // Mock data for the vintage-elegance collection
  if (id === 'vintage-elegance') {
    return NextResponse.json({
      id: 'vintage-elegance',
      title: 'Vintage Elegance',
      description: 'Timeless pieces inspired by classic design elements',
      longDescription: 'Our Vintage Elegance collection draws inspiration from the golden era of jewelry design. Each piece is meticulously crafted to capture the essence of timeless elegance while incorporating modern techniques for everyday wearability. Featuring intricate filigree work, milgrain detailing, and gemstones set in classic arrangements, this collection brings the romance and sophistication of vintage aesthetics to contemporary jewelry lovers.',
      imageUrl: '/images/collections/vintage-elegance.jpg',
      heroImage: '/images/collections/vintage-elegance-hero.jpg',
      theme: 'vintage',
      season: 'all-season',
      products: [
        {
          id: 've-pendant-1',
          name: 'Antique Locket Pendant',
          price: 189.99,
          compareAtPrice: 229.99,
          images: ['/images/products/vintage-pendant-1.jpg', '/images/products/vintage-pendant-2.jpg'],
          avgRating: 4.8,
          reviewCount: 24,
          isNew: false,
          isBestseller: true,
          category: 'necklaces',
          materials: ['gold-plated', 'brass']
        },
        {
          id: 've-ring-1',
          name: 'Victorian Filigree Ring',
          price: 159.99,
          images: ['/images/products/vintage-ring-1.jpg', '/images/products/vintage-ring-2.jpg'],
          avgRating: 4.6,
          reviewCount: 18,
          isNew: true,
          isBestseller: false,
          category: 'rings',
          materials: ['sterling-silver']
        },
        {
          id: 've-earrings-1',
          name: 'Art Deco Drop Earrings',
          price: 129.99,
          images: ['/images/products/vintage-earrings-1.jpg', '/images/products/vintage-earrings-2.jpg'],
          avgRating: 4.7,
          reviewCount: 32,
          isNew: false,
          isBestseller: true,
          category: 'earrings',
          materials: ['gold-plated', 'crystal']
        },
        {
          id: 've-bracelet-1',
          name: 'Edwardian Tennis Bracelet',
          price: 219.99,
          compareAtPrice: 249.99,
          images: ['/images/products/vintage-bracelet-1.jpg', '/images/products/vintage-bracelet-2.jpg'],
          avgRating: 4.9,
          reviewCount: 27,
          isNew: false,
          isBestseller: false,
          category: 'bracelets',
          materials: ['sterling-silver', 'cubic-zirconia']
        },
        {
          id: 've-ring-2',
          name: 'Marquise Cut Solitaire',
          price: 199.99,
          images: ['/images/products/vintage-ring-3.jpg', '/images/products/vintage-ring-4.jpg'],
          avgRating: 4.5,
          reviewCount: 19,
          isNew: true,
          isBestseller: false,
          category: 'rings',
          materials: ['gold-plated', 'cubic-zirconia']
        },
        {
          id: 've-pendant-2',
          name: 'Cameo Brooch Pendant',
          price: 149.99,
          images: ['/images/products/vintage-pendant-3.jpg', '/images/products/vintage-pendant-4.jpg'],
          avgRating: 4.3,
          reviewCount: 15,
          isNew: false,
          isBestseller: false,
          category: 'necklaces',
          materials: ['bronze', 'resin']
        }
      ]
    });
  }
  
  // Mock data for modern-minimalist collection
  if (id === 'modern-minimalist') {
    return NextResponse.json({
      id: 'modern-minimalist',
      title: 'Modern Minimalist',
      description: 'Clean lines and contemporary aesthetics for everyday wear',
      longDescription: 'The Modern Minimalist collection showcases sleek, understated designs that make a statement through simplicity. Perfect for the contemporary jewelry enthusiast who appreciates clean lines and versatile pieces that transition seamlessly from day to night. Each piece in this collection is carefully crafted to achieve a balance between minimalism and distinctive character.',
      imageUrl: '/images/collections/modern-minimalist.jpg',
      heroImage: '/images/collections/modern-minimalist-hero.jpg',
      theme: 'minimalist',
      season: 'all-season',
      products: [
        {
          id: 'mm-ring-1',
          name: 'Geometric Band Ring',
          price: 139.99,
          images: ['/images/products/minimalist-ring-1.jpg', '/images/products/minimalist-ring-2.jpg'],
          avgRating: 4.7,
          reviewCount: 28,
          isNew: true,
          isBestseller: true,
          category: 'rings',
          materials: ['sterling-silver']
        },
        {
          id: 'mm-earrings-1',
          name: 'Linear Bar Studs',
          price: 99.99,
          images: ['/images/products/minimalist-earrings-1.jpg', '/images/products/minimalist-earrings-2.jpg'],
          avgRating: 4.8,
          reviewCount: 42,
          isNew: false,
          isBestseller: true,
          category: 'earrings',
          materials: ['gold-plated']
        },
        {
          id: 'mm-necklace-1',
          name: 'Slim Pendant Necklace',
          price: 119.99,
          images: ['/images/products/minimalist-necklace-1.jpg', '/images/products/minimalist-necklace-2.jpg'],
          avgRating: 4.5,
          reviewCount: 19,
          isNew: false,
          isBestseller: false,
          category: 'necklaces',
          materials: ['gold-plated', 'stainless-steel']
        }
      ]
    });
  }

  // For any other collection, return a 404 response
  return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
} 