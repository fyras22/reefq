import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API route for saving user measurements and sending personalized recommendations
 * In a real application, this would save to a database and possibly trigger an email
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json();
    const { email, measurements, preferences } = data;

    // Input validation
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    if (!measurements) {
      return NextResponse.json({ success: false, message: 'Measurements are required' }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Save measurements to a database
    // 2. Associate with user account if they're logged in
    // 3. Send an email confirmation
    // 4. Generate personalized recommendations
    
    console.log('Received measurement data:', {
      email,
      measurements,
      preferences,
      timestamp: new Date().toISOString()
    });

    // Generate mock personalized recommendations based on measurements
    const recommendations = generateMockRecommendations(measurements);

    // Return success response with recommendations
    return NextResponse.json({
      success: true,
      message: 'Measurements saved successfully',
      recommendations,
      // Include a user ID if this is a new user
      userId: `user_${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error) {
    console.error('Error saving measurements:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while saving measurements' },
      { status: 500 }
    );
  }
}

/**
 * Mock function to generate personalized recommendations based on measurements
 * In a real application, this would use an algorithm or ML model
 */
function generateMockRecommendations(measurements: any) {
  const { type, size } = measurements;
  
  // Mock recommendations for different jewelry types
  const recommendationsByType: Record<string, any[]> = {
    rings: [
      { id: 'r1', name: 'Diamond Solitaire Ring', price: '$1,299', image: '/images/jewelry/ring-1.jpg' },
      { id: 'r2', name: 'Gold Band Ring', price: '$799', image: '/images/jewelry/ring-2.jpg' },
      { id: 'r3', name: 'Sapphire Engagement Ring', price: '$1,599', image: '/images/jewelry/ring-3.jpg' },
    ],
    bracelets: [
      { id: 'b1', name: 'Gold Chain Bracelet', price: '$899', image: '/images/jewelry/bracelet-1.jpg' },
      { id: 'b2', name: 'Silver Bangle', price: '$599', image: '/images/jewelry/bracelet-2.jpg' },
      { id: 'b3', name: 'Diamond Tennis Bracelet', price: '$2,099', image: '/images/jewelry/bracelet-3.jpg' },
    ],
    necklaces: [
      { id: 'n1', name: 'Pearl Necklace', price: '$699', image: '/images/jewelry/necklace-1.jpg' },
      { id: 'n2', name: 'Diamond Pendant', price: '$999', image: '/images/jewelry/necklace-2.jpg' },
      { id: 'n3', name: 'Gold Chain', price: '$799', image: '/images/jewelry/necklace-3.jpg' },
    ]
  };
  
  // Default to rings if type is invalid
  const recommendations = recommendationsByType[type] || recommendationsByType.rings;
  
  // Add size information to each recommendation
  return recommendations.map(item => ({
    ...item,
    fitsYou: true,
    size
  }));
} 