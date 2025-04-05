'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not authenticated, redirect to login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-5">
            <svg
              className="h-8 w-8 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
            {session?.user && (
              <span> You are signed in as <strong>{session.user.email}</strong> with role <strong>{session.user.role}</strong>.</span>
            )}
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-center"
            >
              Return to Home
            </Link>
            
            <Link 
              href="/demo/jewelry"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-center"
            >
              Go to Jewelry Demo
            </Link>
            
            {session?.user && (
              <button 
                onClick={() => router.back()}
                className="block w-full px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-center"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 