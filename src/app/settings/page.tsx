'use client';

import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function SettingsPage() {
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
          <h1 className="text-xl font-bold">Settings</h1>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-foreground hover:text-primary">
              Dashboard
            </Link>
            <Link href="/profile" className="text-foreground hover:text-primary">
              Profile
            </Link>
            <Link href="/settings" className="text-primary hover:underline">
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
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Appearance</h3>
                <div className="rounded-md border border-border p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">Theme</label>
                      <select
                        className="w-full p-2 border border-border rounded-md"
                        defaultValue="system"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Language Preferences</h3>
                <div className="rounded-md border border-border p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">Display Language</label>
                      <select
                        className="w-full p-2 border border-border rounded-md"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="ar">العربية</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
                <div className="rounded-md border border-border p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-brand-teal border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Marketing Updates</label>
                      <input type="checkbox" className="h-4 w-4 text-brand-teal border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">New Feature Announcements</label>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-brand-teal border-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Account Actions</h3>
                <div className="rounded-md border border-border p-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Delete your account and all associated data.
                      </p>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => alert('This action would permanently delete your account.')}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button className="bg-brand-teal text-white hover:bg-brand-teal/90">
                Save Changes
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 