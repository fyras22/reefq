'use client';

import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function ActivityPage() {
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
  
  // Dummy activity data
  const activityItems = [
    {
      id: 1,
      type: 'login',
      date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      ip: '192.168.1.1',
      device: 'Chrome on macOS',
    },
    {
      id: 2,
      type: 'password_change',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      ip: '192.168.1.1',
      device: 'Safari on macOS',
    },
    {
      id: 3,
      type: 'login',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      ip: '192.168.1.1',
      device: 'Firefox on Windows',
    },
    {
      id: 4,
      type: 'login',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      ip: '192.168.1.1',
      device: 'Chrome on macOS',
    }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'login':
        return 'Logged in';
      case 'password_change':
        return 'Changed password';
      case 'profile_update':
        return 'Updated profile';
      default:
        return type.replace('_', ' ');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Activity Log</h1>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-foreground hover:text-primary">
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
            <h2 className="text-2xl font-bold mb-4">Account Activity</h2>
            <p className="text-muted-foreground mb-6">
              A record of recent activity and security events for your account.
            </p>
            
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      IP Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Device
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {activityItems.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getActivityLabel(activity.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(activity.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {activity.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {activity.device}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Only showing the last 30 days of activity
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 