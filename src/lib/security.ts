import { randomBytes, createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { NextResponse } from 'next/server';

// Helper for generating random bytes
const randomBytesAsync = promisify(randomBytes);
const scryptAsync = promisify<string, Buffer, number, Buffer>(scrypt);

/**
 * Default configuration for encryption
 */
const DEFAULT_ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm', // AES-GCM is authenticated encryption
  keyLength: 32, // 256 bits
  saltLength: 16, // 128 bits
  ivLength: 12, // 96 bits for GCM
  tagLength: 16, // 128 bits authentication tag
};

/**
 * Options for encryption
 */
export interface EncryptionOptions {
  /** The encryption algorithm to use */
  algorithm?: string;
  /** The length of the encryption key in bytes */
  keyLength?: number;
  /** The length of the salt in bytes */
  saltLength?: number;
  /** The length of the initialization vector in bytes */
  ivLength?: number;
  /** The length of the authentication tag in bytes */
  tagLength?: number;
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * 
 * @param data Data to encrypt (string or object)
 * @param secretKey Secret key for encryption
 * @param options Encryption options
 * @returns Encrypted data in the format: iv:salt:tag:encrypted_data (base64)
 */
export async function encrypt(
  data: string | object,
  secretKey: string,
  options: EncryptionOptions = {}
): Promise<string> {
  const {
    algorithm,
    keyLength,
    saltLength,
    ivLength,
  } = { ...DEFAULT_ENCRYPTION_CONFIG, ...options };

  // Convert object to string if needed
  const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
  
  // Generate a random salt
  const salt = await randomBytesAsync(saltLength);
  
  // Generate a random IV (initialization vector)
  const iv = await randomBytesAsync(ivLength);

  // Derive key using scrypt with the salt
  const key = await scryptAsync(secretKey, salt, keyLength);

  // Create cipher
  const cipher = createCipheriv(algorithm, key, iv);
  
  // For GCM mode
  if (algorithm.includes('gcm')) {
    // Use type assertion to tell TypeScript this is a GCM cipher
    (cipher as any).setAAD(Buffer.from('authentication'), {
      authTagLength: DEFAULT_ENCRYPTION_CONFIG.tagLength
    });
  }
  
  // Encrypt the data
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Get authentication tag - use type assertion for GCM methods
  const tag = (cipher as any).getAuthTag();

  // Format: iv:salt:tag:encrypted_data (all base64)
  return `${iv.toString('base64')}:${salt.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
}

/**
 * Decrypt data that was encrypted with the encrypt function
 * 
 * @param encryptedData Encrypted data string
 * @param secretKey Secret key for decryption
 * @param options Encryption options
 * @param parseJson Whether to parse the decrypted result as JSON
 * @returns Decrypted data
 */
export async function decrypt<T = string>(
  encryptedData: string,
  secretKey: string,
  options: EncryptionOptions = {},
  parseJson: boolean = false
): Promise<T> {
  const {
    algorithm,
    keyLength,
  } = { ...DEFAULT_ENCRYPTION_CONFIG, ...options };

  // Split the encrypted data into its components
  const parts = encryptedData.split(':');
  if (parts.length !== 4) {
    throw new Error('Invalid encrypted data format');
  }

  const [ivBase64, saltBase64, tagBase64, encryptedText] = parts;

  // Convert back from base64
  const iv = Buffer.from(ivBase64, 'base64');
  const salt = Buffer.from(saltBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');

  // Derive the same key
  const key = await scryptAsync(secretKey, salt, keyLength);

  // Create decipher
  const decipher = createDecipheriv(algorithm, key, iv);
  
  // Set the authentication tag - use type assertion for GCM methods
  (decipher as any).setAuthTag(tag);
  
  // For GCM mode
  if (algorithm.includes('gcm')) {
    // Use type assertion to tell TypeScript this is a GCM decipher
    (decipher as any).setAAD(Buffer.from('authentication'), {
      authTagLength: DEFAULT_ENCRYPTION_CONFIG.tagLength
    });
  }

  // Decrypt
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  // Parse JSON if requested
  if (parseJson) {
    return JSON.parse(decrypted) as T;
  }

  return decrypted as unknown as T;
}

/**
 * Generate a secure random token
 * 
 * @param length Length of the token in bytes (default: 32 bytes)
 * @returns Random token as hex string
 */
export async function generateSecureToken(length: number = 32): Promise<string> {
  const buffer = await randomBytesAsync(length);
  return buffer.toString('hex');
}

/**
 * Hash a value using SHA-256
 * 
 * @param value Value to hash
 * @returns Hashed value
 */
export function hashValue(value: string): string {
  return require('crypto')
    .createHash('sha256')
    .update(value)
    .digest('hex');
}

// CSRF Protection utilities

/**
 * Generate a CSRF token for a session
 * 
 * @param sessionId Session identifier
 * @returns CSRF token
 */
export async function generateCsrfToken(sessionId: string): Promise<string> {
  // Generate a secure random token
  const randomToken = await generateSecureToken(16);
  
  // Combine with session ID and hash
  return hashValue(`${sessionId}:${randomToken}:${Date.now()}`);
}

/**
 * Validate a CSRF token
 * 
 * @param token Token to validate
 * @param expectedToken Expected token
 * @returns Whether the token is valid
 */
export function validateCsrfToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  
  // Constant-time comparison to prevent timing attacks
  return require('crypto').timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expectedToken)
  );
}

// Security Headers Management

/**
 * Security header configurations for different environments
 */
export const securityHeaders = {
  development: {
    // Basic security headers for development
    'X-DNS-Prefetch-Control': 'on',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
  production: {
    // More strict for production
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Content-Security-Policy': generateCSP(),
  },
};

/**
 * Apply security headers to a Next.js response
 * 
 * @param response Next.js response
 * @param environment Current environment
 * @returns Response with security headers
 */
export function applySecurityHeaders(response: NextResponse, environment: 'development' | 'production' = 'production'): NextResponse {
  const headers = securityHeaders[environment];
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Generate a Content Security Policy
 * 
 * @param options CSP options
 * @returns CSP header value
 */
export function generateCSP(options: Partial<CSPOptions> = {}): string {
  const defaultOptions: CSPOptions = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'strict-dynamic'", "https:", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'", "https:"],
    'img-src': ["'self'", "data:", "blob:", "https:"],
    'font-src': ["'self'", "https:", "data:"],
    'connect-src': ["'self'", "https:", "wss:"],
    'media-src': ["'self'", "https:"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'upgrade-insecure-requests': true,
  };

  const cspOptions = { ...defaultOptions, ...options };
  
  return Object.entries(cspOptions)
    .filter(([_, value]) => value !== false)
    .map(([directive, sources]) => {
      if (sources === true) return directive;
      if (Array.isArray(sources)) return `${directive} ${sources.join(' ')}`;
      return '';
    })
    .filter(Boolean)
    .join('; ');
}

/**
 * Options for Content Security Policy
 */
export interface CSPOptions {
  'default-src'?: string[] | false;
  'script-src'?: string[] | false;
  'style-src'?: string[] | false;
  'img-src'?: string[] | false;
  'font-src'?: string[] | false;
  'connect-src'?: string[] | false;
  'media-src'?: string[] | false;
  'object-src'?: string[] | false;
  'base-uri'?: string[] | false;
  'form-action'?: string[] | false;
  'frame-ancestors'?: string[] | false;
  'upgrade-insecure-requests'?: boolean;
  [key: string]: string[] | boolean | undefined;
}

// Data sanitzation utilities

/**
 * Sanitize HTML to prevent XSS attacks
 * 
 * @param html HTML to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  // This is a placeholder. In practice, you would use a dedicated library like DOMPurify
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize URL to prevent javascript: protocol and other malicious URLs
 * 
 * @param url URL to sanitize 
 * @returns Sanitized URL or empty string if malicious
 */
export function sanitizeUrl(url: string): string {
  // Check for javascript: protocol and data: URIs
  const sanitized = url.trim().toLowerCase();
  if (
    sanitized.startsWith('javascript:') ||
    sanitized.startsWith('data:') ||
    sanitized.startsWith('vbscript:')
  ) {
    return '';
  }
  return url;
}

/**
 * Validate and purify email addresses
 * 
 * @param email Email to validate
 * @returns Validated email or null if invalid
 */
export function validateEmail(email: string): string | null {
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email.trim().toLowerCase() : null;
}

/**
 * Mask PII (Personally Identifiable Information)
 * 
 * @param value Value to mask
 * @param keepStart Number of characters to keep at the start
 * @param keepEnd Number of characters to keep at the end
 * @returns Masked value
 */
export function maskPII(value: string, keepStart: number = 2, keepEnd: number = 2): string {
  if (!value || value.length <= keepStart + keepEnd) {
    return value;
  }
  
  const start = value.substring(0, keepStart);
  const end = value.substring(value.length - keepEnd);
  const masked = '*'.repeat(Math.min(value.length - (keepStart + keepEnd), 5));
  
  return `${start}${masked}${end}`;
} 