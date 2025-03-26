'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/providers/AuthProvider';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithOAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Get the redirectUrl from the query parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get('redirectUrl');
    setRedirectUrl(redirect);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log('[Login] Attempting to sign in with:', data.email);
      const result = await signIn(data.email, data.password);
      
      if (result.error) {
        console.error('[Login] Authentication failed:', result.error.message);
        setAuthError(result.error.message);
      } else {
        console.log('[Login] Sign in successful, redirecting to:', redirectUrl || '/dashboard');
        // Set flag to show welcome message on dashboard
        if (typeof window !== 'undefined') {
          try {
            console.log('[Login] Setting justLoggedIn flag in sessionStorage');
            sessionStorage.setItem('justLoggedIn', 'true');
          } catch (e) {
            console.error('[Login] Error setting sessionStorage flag:', e);
          }
        }
        // Force hard navigation to dashboard to ensure proper session handling
        window.location.href = redirectUrl || '/dashboard';
      }
    } catch (error: any) {
      console.error('[Login] Exception during sign in:', error);
      setAuthError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log(`[Login] Initiating ${provider} OAuth flow`);
      await signInWithOAuth(provider);
      // OAuth redirect will happen automatically
    } catch (error: any) {
      console.error(`[Login] ${provider} OAuth error:`, error);
      setAuthError(error.message || `Something went wrong with ${provider} sign in`);
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async () => {
    if (!email || !email.includes('@')) {
      setAuthError('Please enter a valid email address for magic link');
      return;
    }
    
    setMagicLinkLoading(true);
    setAuthError(null);
    
    try {
      // Implement magic link sign-in logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setMagicLinkSent(true);
    } catch (error: any) {
      setAuthError(error.message || 'Error sending magic link');
    } finally {
      setMagicLinkLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-center">
          <Link href="/" className="flex items-center">
            <span className="text-brand-teal text-2xl font-bold">ReefQ</span>
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {magicLinkSent ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-brand-teal/10 mb-4">
                <Mail className="h-8 w-8 text-brand-teal" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Check your inbox</h2>
              <p className="mt-2 text-gray-600">We've sent a magic link to <strong>{email}</strong></p>
              <p className="mt-4 text-sm text-gray-500">
                Click the link in the email to sign in to your account.
              </p>
              <button 
                onClick={() => setMagicLinkSent(false)} 
                className="mt-6 text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
              >
                Use a different method
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
              </div>

              {authError && (
                <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm">
                  <p>{authError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email address"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div className="space-y-2">
                  <Input
                    label="Password"
                    type="password"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <div className="text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-brand-teal hover:text-brand-teal/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  fullWidth={true} 
                  isLoading={isLoading}
                  className="bg-brand-teal hover:bg-brand-teal/90 text-white font-medium"
                >
                  Sign in
                </Button>
              </form>

              <button
                type="button"
                onClick={handleMagicLinkSignIn}
                disabled={magicLinkLoading}
                className="w-full mt-4 flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
              >
                {magicLinkLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending magic link...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Sign in with Magic Link
                  </span>
                )}
              </button>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('facebook')}
                  disabled={isLoading}
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="font-medium text-brand-teal hover:text-brand-teal/80">
                  Sign up
                </Link>
              </p>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} ReefQ. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy</Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 