'use client';

import { useState, useEffect } from 'react';
// import { signIn, useSession } from 'next-auth/react'; // Removed
import { useAuth } from '@/providers/AuthProvider'; // Use correct hook
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SocialAuthButtons from '@/components/ui/social-auth-buttons';
import type { Provider } from '@supabase/supabase-js'; // Import Provider type

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || searchParams?.get('redirectedFrom') || '/dashboard';
  const queryError = searchParams?.get('error');

  const { user, isLoading: authIsLoading, error: authError, signIn, signInWithOAuth } = useAuth();

  const [email, setEmail] = useState(''); // Clear defaults
  const [password, setPassword] = useState(''); // Clear defaults
  // const [rememberMe, setRememberMe] = useState(false); // Removed as Supabase doesn't handle it OOTB
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authIsLoading) {
      router.push(callbackUrl);
    }
  }, [user, authIsLoading, router, callbackUrl]);

  // Set error message
  useEffect(() => {
    if (queryError) {
      setFormError('Login failed via redirect. Please try again.');
    } else if (authError) {
      setFormError(authError.message || 'An authentication error occurred.');
    }
  }, [queryError, authError]);

  // Handle Email/Password Sign In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setFormError(error.message || 'Invalid email or password');
        setIsLoading(false); // Stop loading on error
      } else {
        // Redirect is handled by useEffect
        console.log('Login submitted, waiting for auth state change...');
        // Keep loading true until redirect
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
    // Do not set isLoading false here if login is successful, wait for redirect
  };

  // Handle OAuth Sign In
  const handleOAuthSignIn = async (provider: Provider) => {
    setIsLoading(true);
    setFormError(null);
    try {
        await signInWithOAuth(provider);
        // Redirect happens via Supabase, keep loading true
    } catch(err: any) {
        setFormError(err.message || `Failed to initiate sign in with ${provider}`);
        setIsLoading(false); // Stop loading on OAuth error
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants (remain the same)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Auth Loading State
  if (authIsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-light-gray to-bg-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal mx-auto mb-4"></div>
          <p className="text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-light-gray to-bg-light">
      {/* Left panel - decorative (remains the same) */}
       <div className="hidden lg:flex w-1/2 bg-cover bg-center justify-center items-center"
        style={{ backgroundImage: 'url(/assets/images/auth-bg.jpg)' }}>
         {/* ... left panel content ... */}
         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="px-8 py-12 max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="text-center mb-8"><h2 className="text-3xl font-bold text-gray-800 mb-2">ReefQ Jewelry</h2><div className="h-1 w-16 bg-brand-teal mx-auto mb-4"></div><p className="mt-2 text-gray-600">Premium jewelry visualization platform</p></div>
          <div className="space-y-6"><div className="bg-blue-50 p-4 rounded-lg border border-blue-100"><p className="text-sm text-gray-700">Experience our luxury collection with stunning 3D visualizations and AR try-on features.</p></div><div className="flex justify-center space-x-6"><motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }} className="w-20 h-20 bg-light-gray rounded-full shadow-md flex items-center justify-center"><span className="text-3xl">💎</span></motion.div><motion.div whileHover={{ scale: 1.05, rotate: -5 }} whileTap={{ scale: 0.95 }} className="w-20 h-20 bg-light-gray rounded-full shadow-md flex items-center justify-center"><span className="text-3xl">💍</span></motion.div><motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }} className="w-20 h-20 bg-light-gray rounded-full shadow-md flex items-center justify-center"><span className="text-3xl">👑</span></motion.div></div></div>
         </motion.div>
      </div>

      {/* Right panel - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <div className="h-1 w-16 bg-brand-teal mx-auto my-4"></div>
            <p className="mt-2 text-gray-600">Please sign in to your account</p>
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md"
              >
                {formError}
              </motion.div>
            )}
          </motion.div>

          {/* Pass the Supabase OAuth handler if the component accepts it */}
          {/* Adjust props based on SocialAuthButtons actual implementation */}
          <motion.div variants={itemVariants}>
            <SocialAuthButtons
              onSignInWithProvider={handleOAuthSignIn}
              isLoading={isLoading}
            />
          </motion.div>

          <div className="my-6 flex items-center justify-center">
              <span className="px-2 bg-light-gray text-sm text-gray-500">Or continue with email</span>
          </div>

          {/* Email/password form */}
          <motion.form variants={itemVariants} className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 mt-1 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-teal focus:border-brand-teal transition-colors"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                 {/* Optional: Loading spinner inside input */}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-brand-teal hover:text-brand-gold transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="pl-10 pr-10 mt-1 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-teal focus:border-brand-teal transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                {/* Corrected Password Visibility Toggle Button */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.707l-1.414-1.414a4 4 0 01-5.478-5.478l-1.414-1.414A10.004 10.004 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 002.454-.393z" /></svg>
                    ) : (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                 {/* Optional: Loading spinner separate from button */}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || authIsLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-teal hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 transition-all duration-300 ease-in-out"
              >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Signing In...
                    </>
                ) : 'Sign In'}
              </motion.button>
            </div>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? {' '}
              <Link href="/auth/register" className="font-medium text-brand-teal hover:text-brand-gold transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
