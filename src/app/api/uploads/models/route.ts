import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from 'next-auth/jwt';

// Allowed file types
const ALLOWED_MODEL_TYPES = [
  'model/gltf-binary', 
  'model/gltf+json', 
  'application/octet-stream'
];

// Max file size (in bytes)
const MAX_MODEL_SIZE = 50 * 1024 * 1024; // 50MB

// Base upload directory
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'models');

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: 'You must be logged in to upload files' },
        { status: 401 }
      );
    }

    // Only admin users can upload files
    if (token.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to upload files' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    // Validate presence of file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Check if it's a 3D model or AR model based on file extension and type
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const isARModel = fileExt === 'usdz' || type === 'model-ar';
    
    // Special validation for file types - some browsers don't report correct MIME types for 3D models
    const mimeType = file.type || 'application/octet-stream';
    
    // For GLB/GLTF files
    const isValidModelType = 
      ALLOWED_MODEL_TYPES.includes(mimeType) || 
      fileExt === 'glb' || 
      fileExt === 'gltf' ||
      fileExt === 'usdz';
    
    if (!isValidModelType) {
      return NextResponse.json(
        { error: 'File type not allowed. Only GLB, GLTF, and USDZ files are supported.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_MODEL_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the maximum allowed size (${MAX_MODEL_SIZE / (1024 * 1024)}MB)` },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Determine subdirectory based on model type
    const subDir = isARModel ? 'ar' : '3d';
    const finalUploadDir = join(UPLOAD_DIR, subDir);
    
    // Ensure subdirectory exists
    await mkdir(finalUploadDir, { recursive: true });
    
    const filePath = join(finalUploadDir, fileName);

    // Convert file to buffer and save it
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    // Return the URL for the uploaded file
    const relativePath = filePath.replace(join(process.cwd(), 'public'), '');
    const fileUrl = relativePath.replace(/\\/g, '/');

    return NextResponse.json({
      url: fileUrl,
      fileName,
      id: uuidv4(), // Generate a unique ID for the file
      type: isARModel ? 'ar' : '3d',
      success: true,
    });
  } catch (error) {
    console.error('Error uploading model:', error);
    return NextResponse.json(
      { error: 'Failed to upload model' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
} 