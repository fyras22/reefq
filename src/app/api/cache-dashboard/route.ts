import { NextRequest, NextResponse } from 'next/server';
import { getCache } from '@/lib/cache/ServerCache';
import { auth } from '@/lib/auth';

/**
 * GET /api/cache-dashboard
 * 
 * Provides cache statistics and information for the dashboard
 * Protected endpoint - only accessible to admins
 */
export async function GET(request: NextRequest) {
  // Verify authentication and admin role
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Get cache instance and stats
    const cache = getCache();
    const stats = cache.getStats();
    
    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cache-dashboard
 * 
 * Performs cache management operations:
 * - clear: Clear entire cache
 * - invalidateTag: Invalidate cache by tag
 * 
 * Protected endpoint - only accessible to admins
 */
export async function POST(request: NextRequest) {
  // Verify authentication and admin role
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Parse request body
    const body = await request.json();
    const { action, tag } = body;
    
    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      );
    }
    
    const cache = getCache();
    
    // Perform requested action
    switch (action) {
      case 'clear':
        await cache.clear();
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully',
          timestamp: new Date().toISOString(),
        });
      
      case 'invalidateTag':
        if (!tag) {
          return NextResponse.json(
            { error: 'Missing required field: tag' },
            { status: 400 }
          );
        }
        
        const count = await cache.invalidateByTag(tag);
        return NextResponse.json({
          success: true,
          message: `Cache tag "${tag}" invalidated successfully`,
          invalidatedCount: count,
          timestamp: new Date().toISOString(),
        });
      
      default:
        return NextResponse.json(
          { error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error performing cache operation:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Usage:
 * 
 * // Get cache stats (admin only)
 * fetch('/api/cache-dashboard')
 *   .then(res => res.json())
 *   .then(data => console.log(data));
 * 
 * // Clear cache (admin only)
 * fetch('/api/cache-dashboard', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ action: 'clear' })
 * });
 * 
 * // Invalidate specific cache tag (admin only)
 * fetch('/api/cache-dashboard', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ action: 'invalidateTag', tag: 'products' })
 * });
 */ 