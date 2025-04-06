'use client';

import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        router.push('/auth/login?message=You have been signed out successfully.');
      } catch (error) {
        console.error('Error during logout:', error);
        router.push('/auth/login?error=Failed to sign out');
      }
    };
    
    handleLogout();
  }, [router, signOut]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  );
} 