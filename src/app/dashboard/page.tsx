'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Toast } from '@/components/ui/Toast';
import ClearSessionsButton from './components/ClearSessionsButton';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-primary hover:underline">
              Dashboard
            </Link>
            <Link href="/profile" className="text-foreground hover:text-primary">
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
            <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
            <p className="text-muted-foreground">
              This is a protected page that would normally require authentication.
            </p>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border p-6 bg-card">
              <h3 className="text-lg font-bold mb-2">Your Profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your personal information and preferences.
              </p>
              <Link href="/profile">
                <Button variant="outline" size="sm">View Profile</Button>
              </Link>
            </div>
            
            <div className="rounded-lg border border-border p-6 bg-card">
              <h3 className="text-lg font-bold mb-2">Account Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Update your account settings and security preferences.
              </p>
              <Link href="/settings">
                <Button variant="outline" size="sm">Manage Settings</Button>
              </Link>
            </div>
            
            <div className="rounded-lg border border-border p-6 bg-card">
              <h3 className="text-lg font-bold mb-2">Activity Log</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View your recent account activity and login history.
              </p>
              <Link href="/activity">
                <Button variant="outline" size="sm">View Activity</Button>
              </Link>
            </div>
          </section>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Security</h2>
            <ClearSessionsButton />
          </div>
        </div>
      </main>
    </div>
  );
} 