import { NextResponse } from 'next/server';
import { runHealthCheck } from '@/lib/mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
    arrayBuffers: string;
  };
  env: string;
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error';
      ping?: number;
      version?: string;
      error?: string;
    };
  };
  details?: any;
}

/**
 * GET /api/health
 * Health check endpoint for monitoring service health
 * Returns information about the application and its dependencies
 */
export async function GET(request: Request): Promise<NextResponse> {
  const startTime = performance.now();
  
  // Get system information
  const nodeVersion = process.version;
  const environment = process.env.NODE_ENV || 'development';
  const appVersion = process.env.APP_VERSION || '1.0.0';
  const uptime = process.uptime();
  
  // Get memory usage
  const memoryUsage = process.memoryUsage();
  const formatMemory = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
  };
  
  // Check MongoDB connection
  let dbStatus: HealthCheckResponse['services']['database'];
  try {
    const mongoHealth = await runHealthCheck();
    dbStatus = mongoHealth;
  } catch (error) {
    console.error('Error checking MongoDB health:', error);
    dbStatus = {
      status: 'error',
      error: (error as Error).message,
    };
  }
  
  // Determine overall status
  let overallStatus: 'ok' | 'degraded' | 'unhealthy' = 'ok';
  
  // If database is not connected, mark as degraded
  if (dbStatus.status === 'disconnected') {
    overallStatus = 'degraded';
  }
  
  // If database has an error, mark as unhealthy
  if (dbStatus.status === 'error') {
    overallStatus = 'unhealthy';
  }
  
  // Construct the health check response
  const response: HealthCheckResponse = {
    status: overallStatus,
    version: appVersion,
    uptime: Math.round(uptime),
    timestamp: new Date().toISOString(),
    memory: {
      rss: formatMemory(memoryUsage.rss),
      heapTotal: formatMemory(memoryUsage.heapTotal),
      heapUsed: formatMemory(memoryUsage.heapUsed),
      external: formatMemory(memoryUsage.external),
      arrayBuffers: formatMemory(memoryUsage.arrayBuffers || 0),
    },
    env: environment,
    services: {
      database: dbStatus,
    },
  };
  
  // Include detailed diagnostics if env is not production
  if (environment !== 'production') {
    response.details = {
      node: nodeVersion,
      requestTime: `${(performance.now() - startTime).toFixed(2)}ms`,
      hostname: process.env.HOSTNAME || 'unknown',
      pid: process.pid,
    };
  }
  
  // Set appropriate status code based on health
  const statusCode = overallStatus === 'ok' ? 200 : overallStatus === 'degraded' ? 200 : 503;
  
  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/health+json',
    },
  });
}

/**
 * HEAD /api/health
 * Lightweight health check for load balancers
 */
export function HEAD(request: Request): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

/**
 * This endpoint is designed to be compatible with monitoring services like:
 * - Uptime Robot
 * - Pingdom
 * - Datadog
 * - AWS Route 53 Health Checks
 * - New Relic
 * 
 * For ELB/ALB health checks in AWS, use the HEAD method.
 * 
 * Usage examples:
 * 
 * // Basic health check:
 * curl -i https://example.com/api/health
 * 
 * // Lightweight check (for load balancers):
 * curl -i https://example.com/api/health -X HEAD
 * 
 * // Status codes:
 * 200 OK: Service is healthy or degraded but functioning
 * 503 Service Unavailable: Service is unhealthy
 */ 