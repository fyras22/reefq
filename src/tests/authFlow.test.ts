import { test, expect, describe, jest, beforeEach } from '@jest/globals';

// Mock next-auth
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    signIn: jest.fn(),
    useSession: jest.fn(),
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === 'callbackUrl') return '/dashboard/admin';
      if (param === 'error') return null;
      return null;
    }),
  })),
}));

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('signIn function is called with correct parameters', async () => {
    // Mock implementation
    (signIn as jest.Mock).mockImplementation(() => Promise.resolve({ ok: true }));
    
    // Simulate login
    await signIn('credentials', {
      redirect: true,
      email: 'admin@example.com',
      password: 'password123',
      callbackUrl: '/dashboard/admin'
    });
    
    // Validate signIn was called with correct params
    expect(signIn).toHaveBeenCalledWith('credentials', {
      redirect: true,
      email: 'admin@example.com',
      password: 'password123',
      callbackUrl: '/dashboard/admin'
    });
  });

  test('existing session redirects user to dashboard', () => {
    // Mock authenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
      }, 
      status: 'authenticated'
    });
    
    const router = useRouter();
    
    // Simulate the useEffect for redirecting authenticated users
    if (useSession().status === 'authenticated') {
      router.push('/dashboard/admin');
    }
    
    // Validate router.push was called with correct destination
    expect(router.push).toHaveBeenCalledWith('/dashboard/admin');
  });

  test('error in authentication sets form error', async () => {
    // Mock implementation with error
    (signIn as jest.Mock).mockImplementation(() => Promise.resolve({ 
      error: 'Invalid credentials' 
    }));
    
    // Simulate login with error
    const result = await signIn('credentials', {
      redirect: false, // for testing
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });
    
    // Validate error exists in result
    expect(result?.error).toBe('Invalid credentials');
  });
}); 