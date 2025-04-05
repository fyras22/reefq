import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

// Validation schema for encryption/decryption requests
const encryptSchema = z.object({
  data: z.string().min(1),
  type: z.enum(['email', 'creditCard', 'address', 'phone', 'custom']),
});

const decryptSchema = z.object({
  encryptedData: z.string().min(1),
});

// Encryption configurations
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

// Generate encryption key from environment variable or generate a temporary one (not for production)
function getEncryptionKey() {
  if (!ENCRYPTION_KEY) {
    console.warn('ENCRYPTION_KEY not set in environment variables! Using a temporary key for development.');
    // In production, this would throw an error instead
    return crypto.scryptSync('temporary-dev-key-not-for-production', 'salt', 32);
  }
  
  // Use the provided key and ensure it's 32 bytes (256 bits)
  return crypto.scryptSync(ENCRYPTION_KEY, 'reefq-secure-salt', 32);
}

/**
 * Encrypts sensitive data using AES-256-GCM
 * Returns the encrypted data, initialization vector, and auth tag
 */
function encryptData(data: string): { 
  encryptedData: string; 
  iv: string; 
  authTag: string;
} {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96 bits IV for GCM
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

/**
 * Decrypts data that was encrypted with AES-256-GCM
 * Requires the encrypted data, initialization vector, and auth tag
 */
function decryptData(
  encryptedData: string,
  iv: string,
  authTag: string
): string {
  try {
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(
      ALGORITHM, 
      key, 
      Buffer.from(iv, 'hex')
    );
    
    // Set the authentication tag
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt data: Invalid or tampered data');
  }
}

/**
 * Encryption endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = encryptSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data', errors: result.error.format() },
        { status: 400 }
      );
    }
    
    // Encrypt the data
    const { data, type } = result.data;
    const encrypted = encryptData(data);
    
    // Create the complete encrypted payload
    const encryptedPayload = {
      ...encrypted,
      type,
      timestamp: new Date().toISOString(),
    };
    
    // Return the encrypted data
    return NextResponse.json({
      success: true,
      data: encryptedPayload,
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to encrypt data' },
      { status: 500 }
    );
  }
}

/**
 * Decryption endpoint
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    
    if (!body.encryptedData || !body.iv || !body.authTag) {
      return NextResponse.json(
        { success: false, message: 'Missing required encryption parameters' },
        { status: 400 }
      );
    }
    
    // Decrypt the data
    const decrypted = decryptData(body.encryptedData, body.iv, body.authTag);
    
    // Return the decrypted data
    return NextResponse.json({
      success: true,
      data: decrypted,
      type: body.type,
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to decrypt data' },
      { status: 500 }
    );
  }
} 