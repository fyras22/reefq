'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearSessionsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleClearSessions = async () => {
    if (!confirm('Are you sure you want to clear all your login sessions? You will be logged out on all devices.')) {
      return;
    }
    
    setIsLoading(true);
    setStatusMessage(null);
    
    try {
      // Clear localStorage items related to auth
      if (typeof window !== 'undefined') {
        // Clear Supabase items
        const keysToRemove = [
          'supabase.auth.token',
          'supabase.auth.refreshToken',
          'supabase.auth.user',
          'supabase.auth.expires_at',
          'supabase.auth.expires_in',
          'sb-localhost-auth-token',
          'sb:token',
          'supabase-auth-token',
          'oauth_state'
        ];
        
        // Loop through potential keys and remove them
        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            console.error(`Failed to remove ${key} from localStorage`, e);
          }
        });
        
        // Try to clear any item with 'supabase' in the key
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb:'))) {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.log(`Failed to remove dynamic key ${key}`, e);
            }
          }
        }
      }
      
      setStatusMessage('All sessions cleared successfully');
      // Redirect to landing page
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      setStatusMessage(`Failed to clear sessions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={handleClearSessions}
        disabled={isLoading}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        {isLoading ? 'Clearing...' : 'Clear All Sessions'}
      </button>
      
      {statusMessage && (
        <div className={`text-sm p-2 rounded ${statusMessage.includes('Error') || statusMessage.includes('Failed') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {statusMessage}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        This will log you out from all devices and revoke all active sessions.
      </p>
    </div>
  );
} 