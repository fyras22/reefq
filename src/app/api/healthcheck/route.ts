import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DatabaseStatus {
  status: string;
  responseTime: number;
  message?: string;
}

interface HealthcheckResponse {
  uptime: number;
  status: string;
  timestamp: string;
  environment: string;
  version: string;
  responseTime?: number;
  services: {
    database: DatabaseStatus;
  };
}

/**
 * Health check endpoint for uptime monitoring and load balancers
 * Returns basic information about application status
 */
export async function GET() {
  const startTime = Date.now();
  
  // Check MongoDB connection if needed
  // const dbStatus = await checkDbConnection();
  
  // Simple response time calculation
  const responseTime = Date.now() - startTime;
  
  // Basic system information
  const healthData = {
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime,
    // database: dbStatus,
    services: {
      api: 'up',
      // Add other dependent services here
    }
  };
  
  // Return health status with appropriate headers
  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Ensure monitoring services can check application health via HEAD requests
 */
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
} 