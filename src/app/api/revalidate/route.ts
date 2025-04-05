import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

// Enhanced validation schema for revalidation requests
const revalidateSchema = z.object({
  paths: z.array(z.string()).optional(),
  path: z.string().optional(),
  tags: z.array(z.string()).optional(),
  tag: z.string().optional(),
  secret: z.string(),
  reason: z.string().optional(),
});

type RevalidationLog = {
  timestamp: string;
  type: 'path' | 'tag';
  target: string;
  success: boolean;
  reason?: string;
};

/**
 * API handler for revalidating Next.js cache
 * Supports both path-based and tag-based revalidation
 * Enhanced with logging and support for multiple paths/tags
 */
export async function POST(request: NextRequest) {
  const revalidationLogs: RevalidationLog[] = [];
  const startTime = Date.now();
  let requestId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  try {
    // Parse the request body
    const body = await request.json();
    
    // Basic secret validation first for better security
    if (body.secret !== process.env.REVALIDATION_SECRET) {
      console.warn(`[${requestId}] Invalid revalidation secret provided`);
      return NextResponse.json(
        { success: false, message: 'Invalid revalidation secret' },
        { status: 401 }
      );
    }
    
    // Validate request with zod
    const result = revalidateSchema.safeParse(body);
    
    if (!result.success) {
      console.warn(`[${requestId}] Invalid revalidation payload`, result.error.format());
      return NextResponse.json(
        { success: false, message: 'Invalid payload', errors: result.error.format() },
        { status: 400 }
      );
    }
    
    const { path, paths, tag, tags, reason } = result.data;
    const hasPathTarget = path || (paths && paths.length > 0);
    const hasTagTarget = tag || (tags && tags.length > 0);
    
    if (!hasPathTarget && !hasTagTarget) {
      console.warn(`[${requestId}] No revalidation target provided`);
      return NextResponse.json(
        { success: false, message: 'At least one path or tag must be provided' },
        { status: 400 }
      );
    }
    
    // Process paths for revalidation
    if (hasPathTarget) {
      // Handle single path
      if (path) {
        try {
          revalidatePath(path);
          revalidationLogs.push({
            timestamp: new Date().toISOString(),
            type: 'path',
            target: path,
            success: true,
            reason,
          });
          console.log(`[${requestId}] Revalidated path: ${path}`);
        } catch (error) {
          revalidationLogs.push({
            timestamp: new Date().toISOString(),
            type: 'path',
            target: path,
            success: false,
            reason: error instanceof Error ? error.message : 'Unknown error',
          });
          console.error(`[${requestId}] Failed to revalidate path: ${path}`, error);
        }
      }
      
      // Handle multiple paths
      if (paths && paths.length > 0) {
        for (const pathItem of paths) {
          try {
            revalidatePath(pathItem);
            revalidationLogs.push({
              timestamp: new Date().toISOString(),
              type: 'path',
              target: pathItem,
              success: true,
              reason,
            });
            console.log(`[${requestId}] Revalidated path: ${pathItem}`);
          } catch (error) {
            revalidationLogs.push({
              timestamp: new Date().toISOString(),
              type: 'path',
              target: pathItem,
              success: false,
              reason: error instanceof Error ? error.message : 'Unknown error',
            });
            console.error(`[${requestId}] Failed to revalidate path: ${pathItem}`, error);
          }
        }
      }
    }
    
    // Process tags for revalidation
    if (hasTagTarget) {
      // Handle single tag
      if (tag) {
        try {
          revalidateTag(tag);
          revalidationLogs.push({
            timestamp: new Date().toISOString(),
            type: 'tag',
            target: tag,
            success: true,
            reason,
          });
          console.log(`[${requestId}] Revalidated tag: ${tag}`);
        } catch (error) {
          revalidationLogs.push({
            timestamp: new Date().toISOString(),
            type: 'tag',
            target: tag,
            success: false,
            reason: error instanceof Error ? error.message : 'Unknown error',
          });
          console.error(`[${requestId}] Failed to revalidate tag: ${tag}`, error);
        }
      }
      
      // Handle multiple tags
      if (tags && tags.length > 0) {
        for (const tagItem of tags) {
          try {
            revalidateTag(tagItem);
            revalidationLogs.push({
              timestamp: new Date().toISOString(),
              type: 'tag',
              target: tagItem,
              success: true,
              reason,
            });
            console.log(`[${requestId}] Revalidated tag: ${tagItem}`);
          } catch (error) {
            revalidationLogs.push({
              timestamp: new Date().toISOString(),
              type: 'tag',
              target: tagItem,
              success: false,
              reason: error instanceof Error ? error.message : 'Unknown error',
            });
            console.error(`[${requestId}] Failed to revalidate tag: ${tagItem}`, error);
          }
        }
      }
    }
    
    // Calculate success rate
    const totalOperations = revalidationLogs.length;
    const successfulOperations = revalidationLogs.filter(log => log.success).length;
    const allSuccessful = totalOperations > 0 && successfulOperations === totalOperations;
    
    // Log completion metrics
    const completionTime = Date.now() - startTime;
    console.log(`[${requestId}] Revalidation completed in ${completionTime}ms, ${successfulOperations}/${totalOperations} operations successful`);
    
    return NextResponse.json({
      success: allSuccessful,
      revalidated: true,
      requestId,
      statistics: {
        total: totalOperations,
        successful: successfulOperations,
        duration: `${completionTime}ms`,
      },
      logs: revalidationLogs,
    });
  } catch (error) {
    console.error(`[${requestId}] Revalidation error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing revalidation request', 
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
        logs: revalidationLogs,
      },
      { status: 500 }
    );
  }
} 