'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { Mail, CheckCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const { user, verifyEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a token in the URL (clicked from email link)
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      verifyWithToken(token);
    }
    
    // Get the email from the URL or from the current user
    const urlEmail = searchParams.get('email');
    if (urlEmail) {
      setEmail(urlEmail);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [searchParams, user]);

  const verifyWithToken = async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await verifyEmail(token);
      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess(true);
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Implementation would depend on your auth provider's API
      // For example:
      // await resendVerificationEmail(email);
      
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message (optionally)
      // setResendSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification email');
    } finally {
      setIsLoading(false);
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
          {success ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-brand-teal/10 mb-4">
                <CheckCircle className="h-8 w-8 text-brand-teal" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Email verified</h2>
              <p className="mt-2 text-gray-600">
                Your email has been successfully verified
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-brand-teal text-white hover:bg-brand-teal/90 transition-colors"
                >
                  Continue to dashboard
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-brand-teal/10 mb-4">
                  <Mail className="h-8 w-8 text-brand-teal" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Verify your email</h1>
                {email && <p className="mt-2 text-gray-600">We've sent a verification email to <strong>{email}</strong></p>}
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm">
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="rounded-md bg-blue-50 p-4 text-blue-700 text-sm">
                  <p>
                    Please check your inbox and click the verification link in the email we sent you.
                    If you don't see it, check your spam folder.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Didn't receive an email?
                  </p>
                  <Button
                    type="button"
                    onClick={handleResendVerification}
                    isLoading={isLoading}
                    disabled={!email}
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Resend verification email
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <Link
                    href="/auth/login"
                    className="text-brand-teal hover:text-brand-teal/80 font-medium"
                  >
                    Back to sign in
                  </Link>
                </div>
              </div>
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