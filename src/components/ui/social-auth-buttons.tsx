'use client';

// import { signIn } from 'next-auth/react'; // Remove NextAuth import
import { motion } from 'framer-motion';
import type { Provider } from '@supabase/supabase-js'; // Import Supabase Provider type

interface SocialAuthButtonsProps {
  // action: 'sign in' | 'sign up'; // Remove unused prop
  // callbackUrl?: string; // Remove unused prop
  onSignInWithProvider: (provider: Provider) => Promise<void> | void; // Add handler prop
  isLoading?: boolean; // Add prop to disable buttons during loading
  className?: string;
}

export default function SocialAuthButtons({
  // action = 'sign in', // Remove unused prop
  // callbackUrl = '/dashboard',
  onSignInWithProvider, // Use the passed handler
  isLoading = false,
  className = '',
}: SocialAuthButtonsProps) {
  // const actionText = action === 'sign in' ? 'Continue with' : 'Sign up with'; // Remove action text logic

  // const handleOAuthSignIn = (provider: string) => {
  //   signIn(provider, { callbackUrl });
  // }; // Remove internal handler

  return (
    <div className={`space-y-4 ${className}`}>
      <motion.button
        type="button" // Ensure type is button
        whileHover={!isLoading ? { scale: 1.03 } : {}} // Disable hover effect when loading
        whileTap={!isLoading ? { scale: 0.98 } : {}} // Disable tap effect when loading
        onClick={() => !isLoading && onSignInWithProvider('google')} // Use passed handler
        disabled={isLoading} // Disable button when loading
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Google SVG */} <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/><path d="M7.004,13.455l-2.822,2.172C5.192,18.044,8.267,20,12.545,20c3.347,0,5.87-1.287,7.108-3.568l-2.814-2.182c-0.782,1.204-2.118,1.935-4.294,1.935C9.75,16.185,7.765,15.051,7.004,13.455z" fill="#34A853"/><path d="M7.004,10.545c-0.344-1.026-0.344-2.067,0-3.091l-2.822-2.172C2.752,7.624,2.21,10.219,3.176,12.62L7.004,10.545z" fill="#FBBC05"/><path d="M12.545,6.783c1.822,0,3.465,0.624,4.739,1.866l2.486-2.486C18.146,4.641,15.313,3.091,12.545,3.091c-4.278,0-7.353,1.957-9.187,5.364l2.822,2.172C7.042,8.639,9.027,6.783,12.545,6.783z" fill="#EA4335"/></svg>
        Continue with Google
      </motion.button>

      <motion.button
        type="button"
        whileHover={!isLoading ? { scale: 1.03 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
        onClick={() => !isLoading && onSignInWithProvider('github')} // Use passed handler
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
         {/* GitHub SVG */}<svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        Continue with GitHub
      </motion.button>

      {/* Separator moved outside */}
      {/* <div className="flex items-center my-6">...</div> */}
    </div>
  );
} 