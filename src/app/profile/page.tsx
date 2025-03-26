'use client';

import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    if (!isLoading && !user) {
      window.location.href = '/auth/login';
    }
  }, [user, isLoading]);
  
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Profile</h1>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-foreground hover:text-primary">
              Dashboard
            </Link>
            <Link href="/profile" className="text-primary hover:underline">
              Profile
            </Link>
            <Link href="/settings" className="text-foreground hover:text-primary">
              Settings
            </Link>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="outline" size="sm">Sign out</Button>
            </form>
          </nav>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="space-y-8">
          <section className="rounded-lg border border-border p-6 bg-card">
            <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <div className="rounded-md border border-border p-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm col-span-2">{user.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <span className="text-sm text-muted-foreground">Account ID:</span>
                      <span className="text-sm col-span-2">{user.id}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-muted-foreground">Email verified:</span>
                      <span className="text-sm col-span-2">
                        {user.email_confirmed_at ? 'Yes' : 'No'}
                        {!user.email_confirmed_at && (
                          <Link href="/auth/verify-email" className="ml-2 text-brand-teal hover:underline">
                            Verify now
                          </Link>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Security</h3>
                  <div className="rounded-md border border-border p-4">
                    <div className="space-y-3">
                      <Link href="/auth/reset-password" className="text-brand-teal hover:underline text-sm">
                        Change password
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Account Preferences</h3>
                <div className="rounded-md border border-border p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure your account preferences and notification settings.
                  </p>
                  <Link href="/settings">
                    <Button variant="outline" size="sm">Manage Settings</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 