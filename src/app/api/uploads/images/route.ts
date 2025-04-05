import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from 'next-auth/jwt';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Max file size (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Base upload directory
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'images');

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

    // Validate presence of file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Validate file type (MIME type)
    const mimeType = file.type || 'application/octet-stream';
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'File type not allowed. Only JPEG, PNG, WebP, and GIF images are supported.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the maximum allowed size (${MAX_IMAGE_SIZE / (1024 * 1024)}MB)` },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, fileName);

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
      success: true,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
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