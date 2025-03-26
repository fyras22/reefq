'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/providers/AuthProvider';
import { Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await requestPasswordReset(data.email);
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
                <Mail className="h-8 w-8 text-brand-teal" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Check your inbox</h2>
              <p className="mt-2 text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Click the link in the email to reset your password.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="text-brand-teal hover:text-brand-teal/80 font-medium"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Reset your password</h1>
                <p className="mt-2 text-gray-600">
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email address"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button 
                  type="submit" 
                  fullWidth={true} 
                  isLoading={isLoading}
                  className="bg-brand-teal hover:bg-brand-teal/90 text-white font-medium"
                >
                  Send reset link
                </Button>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-brand-teal hover:text-brand-teal/80 font-medium"
                  >
                    Back to sign in
                  </Link>
                </div>
              </form>
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