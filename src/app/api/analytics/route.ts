import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// Rate limiter for analytics endpoint
const analyticsLimiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000, // 1 minute
});

// Schema for event validation
const eventSchema = z.object({
  type: z.enum(['event', 'pageview', 'error', 'performance', 'identify']),
  data: z.record(z.any()).refine(data => !!data, {
    message: 'Event data is required'
  }),
});

/**
 * POST /api/analytics
 * Receives analytics events from the client
 */
export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    try {
      await analyticsLimiter.check(50, 'ANALYTICS_RATE_LIMIT');
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate request data
    const parsedEvent = eventSchema.safeParse(body);
    if (!parsedEvent.success) {
      return NextResponse.json(
        { error: 'Invalid event data', details: parsedEvent.error },
        { status: 400 }
      );
    }

    // Extract event data
    const { type, data } = parsedEvent.data;
    
    // Add request metadata
    const metadata = {
      ip: req.ip || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      referer: req.headers.get('referer') || 'unknown',
      country: req.geo?.country || 'unknown',
      city: req.geo?.city || 'unknown',
      region: req.geo?.region || 'unknown',
      timestamp: new Date().toISOString(),
    };

    // Process different event types
    switch (type) {
      case 'event':
        await processEventData(data, metadata);
        break;
      case 'pageview':
        await processPageViewData(data, metadata);
        break;
      case 'error':
        await processErrorData(data, metadata);
        break;
      case 'performance':
        await processPerformanceData(data, metadata);
        break;
      case 'identify':
        await processIdentifyData(data, metadata);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * In a production environment, these functions would store data
 * in a database or send it to an analytics provider
 */

async function processEventData(data: any, metadata: any) {
  // Store event data in database or send to analytics provider
  console.log('EVENT:', { ...data, ...metadata });
  
  // Here you would typically:
  // 1. Store in database (MongoDB)
  // 2. Send to third-party analytics service
  // 3. Process for real-time dashboards
}

async function processPageViewData(data: any, metadata: any) {
  // Store page view data
  console.log('PAGEVIEW:', { ...data, ...metadata });
}

async function processErrorData(data: any, metadata: any) {
  // Store error data
  console.log('ERROR:', { ...data, ...metadata });
  
  // For critical errors, you might want to:
  // 1. Send alerts
  // 2. Create incident tickets
  // 3. Store detailed diagnostics
}

async function processPerformanceData(data: any, metadata: any) {
  // Store performance metrics
  console.log('PERFORMANCE:', { ...data, ...metadata });
}

async function processIdentifyData(data: any, metadata: any) {
  // Store user identification data
  console.log('IDENTIFY:', { ...data, ...metadata });
  
  // Be careful with PII (Personally Identifiable Information)
  // Consider encrypting sensitive data
} 