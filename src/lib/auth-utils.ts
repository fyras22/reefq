import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Simplified session type for demo purposes
interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface Session {
  user: User;
  expires: string;
}

/**
 * Simplified auth implementation for demo purposes
 * In a real app, this would use next-auth or a similar library
 */
export async function auth(): Promise<Session | null> {
  // This is a mock implementation
  // In a real app, this would validate cookies/JWT tokens
  const authCookie = cookies().get('auth-session');
  
  if (!authCookie) {
    return null;
  }
  
  // Mock user for demonstration
  return {
    user: {
      id: '1',
      name: 'Demo User',
      email: 'user@example.com',
      role: 'user',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Enhanced authentication state check that provides detailed session status
 * @returns An object containing session data and authentication status
 */
export async function getAuthStatus() {
  const session = await auth();
  
  return {
    session,
    isAuthenticated: !!session?.user,
    isAdmin: !!session?.user?.role && session.user.role === 'admin',
    user: session?.user || null,
  };
}

/**
 * Enforces authentication, redirecting to login if user is not authenticated
 * @param redirectTo The path to redirect to after successful authentication
 * @returns The session object if authenticated
 */
export async function requireAuth(redirectTo?: string): Promise<Session> {
  const session = await auth();
  
  if (!session?.user) {
    const callbackUrl = redirectTo || '/';
    const searchParams = new URLSearchParams({
      callbackUrl: encodeURIComponent(callbackUrl),
    });
    
    redirect(`/login?${searchParams.toString()}`);
  }
  
  return session;
}

/**
 * Enforces admin role, redirecting to homepage if user is not an admin
 * @returns The session object if authenticated and admin
 */
export async function requireAdmin(): Promise<Session> {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=%2Fadmin');
  }
  
  if (session.user.role !== 'admin') {
    redirect('/');
  }
  
  return session;
}

/**
 * Creates a secure session identifier token for cross-site requests
 * Useful for CSRF protection in forms
 */
export async function generateSessionToken(): Promise<string> {
  const session = await auth();
  if (!session?.user) return '';
  
  // Create a unique token based on user ID and timestamp
  const tokenData = {
    userId: session.user.id,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2, 15),
  };
  
  // In a real app, this would use encryption
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

/**
 * Validates a session token from a form submission
 * Used for CSRF protection
 */
export async function validateSessionToken(token: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user) return false;
    
    // Decode and parse the token
    const tokenDataStr = Buffer.from(token, 'base64').toString('utf-8');
    const tokenData = JSON.parse(tokenDataStr);
    
    // Validate the token belongs to the current user
    if (tokenData.userId !== session.user.id) {
      return false;
    }
    
    // Check if token is expired (tokens valid for 1 hour)
    const tokenAge = Date.now() - tokenData.timestamp;
    const MAX_TOKEN_AGE = 60 * 60 * 1000; // 1 hour
    
    return tokenAge < MAX_TOKEN_AGE;
  } catch (error) {
    return false;
  }
}

/**
 * Sets secure authentication cookies with appropriate settings
 * @param name Cookie name
 * @param value Cookie value
 * @param options Additional cookie options
 */
export function setAuthCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    path?: string;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
) {
  const cookieStore = cookies();
  
  const defaultOptions = {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax' as const,
  };
  
  const cookieOptions = { ...defaultOptions, ...options };
  
  cookieStore.set(name, value, cookieOptions);
}

/**
 * Safely removes an authentication cookie
 * @param name Cookie name
 */
export function removeAuthCookie(name: string) {
  const cookieStore = cookies();
  cookieStore.delete(name);
} 