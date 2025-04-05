import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

// Validate incoming metrics payload
const metricSchema = z.object({
  name: z.string(),
  value: z.number(),
  id: z.string(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  path: z.string(),
  timestamp: z.number().optional(),
});

type MetricPayload = z.infer<typeof metricSchema>;

// Rate limiter configuration - allow 50 requests per minute
const limiter = rateLimit({
  uniqueTokenPerInterval: 100,
  interval: 60 * 1000, // 1 minute
  limit: 50, // 50 requests per minute
});

export async function POST(req: Request) {
  try {
    // Check rate limit
    const ip = headers().get('x-forwarded-for') || 'anonymous';
    const remaining = await limiter.check(ip);
    
    if (!remaining.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' }, 
        { status: 429 }
      );
    }
    
    // Parse and validate the request body
    const body = await req.json();
    const result = metricSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const metric = result.data;
    
    // Additional client information
    const userAgent = headers().get('user-agent') || 'unknown';
    const countryCode = headers().get('x-vercel-ip-country') || 'unknown';
    const region = headers().get('x-vercel-ip-country-region') || 'unknown';
    
    // Enrich the metric data
    const enrichedMetric = {
      ...metric,
      userAgent,
      countryCode,
      region,
      timestamp: metric.timestamp || Date.now(),
    };
    
    // In a production environment, you would store this data 
    // in a database or send it to an analytics service
    console.log('Received metric:', enrichedMetric);
    
    // Here you could insert into MongoDB or another database:
    // await db.collection('metrics').insertOne(enrichedMetric);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing metrics:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 