import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for the web vitals data
const webVitalSchema = z.object({
  name: z.enum(['CLS', 'FID', 'LCP', 'FCP', 'TTFB']),
  value: z.number(),
  id: z.string(),
  delta: z.number(),
  navigationType: z.string().optional(),
  path: z.string(),
  deviceType: z.enum(['mobile', 'tablet', 'desktop', 'unknown']),
  connectionType: z.string(),
  timestamp: z.string()
});

type WebVitalData = z.infer<typeof webVitalSchema>;

// Set threshold values for poor performance
const thresholds = {
  LCP: 2500, // milliseconds
  FID: 100,  // milliseconds
  CLS: 0.1,  // unitless
  FCP: 1800, // milliseconds
  TTFB: 800  // milliseconds
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Validate the data
    const validatedData = webVitalSchema.parse(data);
    
    // Check if the metric exceeds the threshold
    const { name, value } = validatedData;
    const isThresholdExceeded = value > thresholds[name as keyof typeof thresholds];
    
    // Add threshold information
    const enrichedData: WebVitalData & { 
      isThresholdExceeded: boolean, 
      threshold: number 
    } = {
      ...validatedData,
      isThresholdExceeded,
      threshold: thresholds[name as keyof typeof thresholds]
    };
    
    // In a production app, you would store this in a database
    // For this example, we'll just log to the console
    console.log('Web Vital:', enrichedData);
    
    // Send to monitoring service if available
    if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // This is where you would send to Vercel Analytics or Sentry
      // Implementation would depend on your chosen provider
    }
    
    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing web vital:', error);
    
    // Return an error response
    return NextResponse.json(
      { error: 'Failed to process web vital data' },
      { status: 400 }
    );
  }
} 