import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Mock data for collections
  const collections = [
    {
      id: 'vintage-elegance',
      title: 'Vintage Elegance',
      description: 'Timeless pieces inspired by classic design elements',
      imageUrl: '/images/collections/vintage-elegance.jpg',
      products: 24,
      featured: true,
      theme: 'vintage',
      season: 'all-season'
    },
    {
      id: 'modern-minimalist',
      title: 'Modern Minimalist',
      description: 'Clean lines and contemporary aesthetics for everyday wear',
      imageUrl: '/images/collections/modern-minimalist.jpg',
      products: 18,
      featured: true,
      theme: 'minimalist',
      season: 'all-season'
    },
    {
      id: 'royal-heritage',
      title: 'Royal Heritage',
      description: 'Luxurious pieces inspired by royal jewelry traditions',
      imageUrl: '/images/collections/royal-heritage.jpg',
      products: 12,
      featured: true,
      theme: 'luxury',
      season: 'winter'
    },
    {
      id: 'nature-inspired',
      title: 'Nature Inspired',
      description: 'Designs that capture the beauty of the natural world',
      imageUrl: '/images/collections/nature-inspired.jpg',
      products: 20,
      featured: false,
      theme: 'nature',
      season: 'spring'
    },
    {
      id: 'celestial-dreams',
      title: 'Celestial Dreams',
      description: 'Star and moon motifs for the dreamers and night owls',
      imageUrl: '/images/collections/celestial-dreams.jpg',
      products: 15,
      featured: false,
      theme: 'celestial',
      season: 'winter'
    },
    {
      id: 'summer-vibes',
      title: 'Summer Vibes',
      description: 'Vibrant and colorful pieces perfect for warm days',
      imageUrl: '/images/collections/summer-vibes.jpg',
      products: 22,
      featured: false,
      theme: 'vibrant',
      season: 'summer'
    },
    {
      id: 'bohemian-spirit',
      title: 'Bohemian Spirit',
      description: 'Free-spirited designs for the unconventional soul',
      imageUrl: '/images/collections/bohemian-spirit.jpg',
      products: 17,
      featured: false,
      theme: 'bohemian',
      season: 'summer'
    },
    {
      id: 'autumn-whispers',
      title: 'Autumn Whispers',
      description: 'Warm tones and organic textures inspired by fall',
      imageUrl: '/images/collections/autumn-whispers.jpg',
      products: 14,
      featured: false,
      theme: 'organic',
      season: 'fall'
    }
  ];

  return NextResponse.json(collections);
} 