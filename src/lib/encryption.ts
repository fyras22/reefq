import crypto from 'crypto';

// Define encryption algorithm and key source
const ALGORITHM = 'aes-256-gcm';

/**
 * Get encryption key from environment variable
 * Falls back to a development-only key (not for production)
 */
function getEncryptionKey(): Buffer {
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
  
  if (!encryptionKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY not set in environment variables');
    }
    console.warn('ENCRYPTION_KEY not set in environment variables! Using a temporary key for development.');
    return crypto.scryptSync('temporary-dev-key-not-for-production', 'salt', 32);
  }
  
  // Use the provided key and ensure it's 32 bytes (256 bits)
  return crypto.scryptSync(encryptionKey, 'reefq-secure-salt', 32);
}

/**
 * Encrypt a string using AES-256-GCM
 * @param data String data to encrypt
 * @returns Encrypted data object with encryptedData, iv, and authTag
 */
export function encrypt(data: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96 bits IV for GCM
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Combine everything into a single string for storage
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a string that was encrypted with AES-256-GCM
 * @param encryptedString Combined string in format "iv:authTag:encryptedData"
 * @returns Original decrypted string
 */
export function decrypt(encryptedString: string): string {
  try {
    // Split the combined string into its components
    const [ivHex, authTag, encryptedData] = encryptedString.split(':');
    
    if (!ivHex || !authTag || !encryptedData) {
      throw new Error('Invalid encrypted string format');
    }
    
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(ivHex, 'hex')
    );
    
    // Set the authentication tag
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data: Invalid or tampered data');
  }
}

/**
 * Safe encryption that handles errors
 * @param data Data to encrypt
 * @returns Encrypted string or null if encryption fails
 */
export function safeEncrypt(data: string): string | null {
  try {
    return encrypt(data);
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

/**
 * Safe decryption that handles errors
 * @param encryptedString String to decrypt
 * @returns Decrypted string or null if decryption fails
 */
export function safeDecrypt(encryptedString: string): string | null {
  try {
    return decrypt(encryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Generate a secure random string (for tokens, etc.)
 * @param length Length of the random string
 * @returns Random hex string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
} 