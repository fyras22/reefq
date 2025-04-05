import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/lib/auth';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_MODEL_TYPES = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
const ALLOWED_AR_TYPES = ['model/vnd.usdz+zip', 'application/octet-stream'];

// Max file sizes (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_MODEL_SIZE = 50 * 1024 * 1024; // 50MB

// Base upload directory
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to upload files' },
        { status: 401 }
      );
    }

    // Only admin users can upload files
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to upload files' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    // Validate presence of file and type
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'File type not specified' },
        { status: 400 }
      );
    }

    // Create upload directories if they don't exist
    let uploadPath = '';
    let allowedTypes: string[] = [];
    let maxSize = 0;

    if (type === 'image') {
      uploadPath = join(UPLOAD_DIR, 'images');
      allowedTypes = ALLOWED_IMAGE_TYPES;
      maxSize = MAX_IMAGE_SIZE;
    } else if (type === 'model-3d') {
      uploadPath = join(UPLOAD_DIR, 'models');
      allowedTypes = ALLOWED_MODEL_TYPES;
      maxSize = MAX_MODEL_SIZE;
    } else if (type === 'model-ar') {
      uploadPath = join(UPLOAD_DIR, 'ar');
      allowedTypes = ALLOWED_AR_TYPES;
      maxSize = MAX_MODEL_SIZE;
    } else {
      return NextResponse.json(
        { error: 'Invalid file type specified' },
        { status: 400 }
      );
    }

    await mkdir(uploadPath, { recursive: true });

    // Validate file type (MIME type)
    const mimeType = file.type || 'application/octet-stream';
    if (!allowedTypes.includes(mimeType) && 
        !(type === 'model-3d' && file.name.endsWith('.glb')) && 
        !(type === 'model-ar' && file.name.endsWith('.usdz'))) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds the maximum allowed size (${maxSize / (1024 * 1024)}MB)` },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadPath, fileName);

    // Convert file to buffer and save it
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    // Return the URL for the uploaded file
    const relativePath = filePath.replace(join(process.cwd(), 'public'), '');
    const fileUrl = relativePath.replace(/\\/g, '/');

    return NextResponse.json({
      url: fileUrl,
      fileName,
      success: true,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
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

// Configure Next.js API route config to handle file uploads
export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll handle the multipart form data manually
  },
}; 