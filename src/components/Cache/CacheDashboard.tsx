'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  evictions: number;
  revalidations: number;
  hitRate: number;
}

interface DashboardData {
  stats: CacheStats;
  timestamp: string;
  environment: string;
}

/**
 * Cache Dashboard Component
 * Provides an admin interface for viewing and managing the server cache
 */
export default function CacheDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tag, setTag] = useState('');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Check if user is authorized
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/unauthorized');
      }
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/cache');
    }
  }, [session, status, router]);
  
  // Fetch cache stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cache-dashboard');
      
      if (!res.ok) {
        throw new Error(`Failed to fetch cache stats: ${res.status} ${res.statusText}`);
      }
      
      const responseData = await res.json();
      setData(responseData);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch and setup refresh interval
  useEffect(() => {
    fetchStats();
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);
  
  // Handle refresh interval changes
  useEffect(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    if (refreshInterval) {
      const interval = setInterval(fetchStats, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);
  
  // Handle clear cache action
  const handleClearCache = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cache-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to clear cache: ${res.status} ${res.statusText}`);
      }
      
      const responseData = await res.json();
      setSuccessMessage(responseData.message);
      fetchStats();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle invalidate tag action
  const handleInvalidateTag = async () => {
    if (!tag.trim()) {
      setError('Please enter a tag to invalidate');
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch('/api/cache-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invalidateTag', tag: tag.trim() }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to invalidate tag: ${res.status} ${res.statusText}`);
      }
      
      const responseData = await res.json();
      setSuccessMessage(`${responseData.message} (${responseData.invalidatedCount} entries)`);
      setTag('');
      fetchStats();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // Formatted time from timestamp
  const formattedTime = data?.timestamp 
    ? new Date(data.timestamp).toLocaleString() 
    : '';
  
  // Handle unauthorized or loading state
  if (status === 'loading' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cache Management Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Auto Refresh:</span>
          <select
            value={refreshInterval || ''}
            onChange={(e) => setRefreshInterval(e.target.value ? Number(e.target.value) : null)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Off</option>
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="30">30s</option>
            <option value="60">1m</option>
          </select>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-red-500 font-bold">×</span>
          </button>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Cache Statistics</h2>
          {loading && !data ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : data ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-gray-600">Cache Size:</dt>
              <dd className="font-medium">{data.stats.size} items</dd>
              
              <dt className="text-gray-600">Cache Hits:</dt>
              <dd className="font-medium">{data.stats.hits}</dd>
              
              <dt className="text-gray-600">Cache Misses:</dt>
              <dd className="font-medium">{data.stats.misses}</dd>
              
              <dt className="text-gray-600">Hit Rate:</dt>
              <dd className="font-medium">{(data.stats.hitRate * 100).toFixed(2)}%</dd>
              
              <dt className="text-gray-600">Evictions:</dt>
              <dd className="font-medium">{data.stats.evictions}</dd>
              
              <dt className="text-gray-600">Revalidations:</dt>
              <dd className="font-medium">{data.stats.revalidations}</dd>
              
              <dt className="text-gray-600">Environment:</dt>
              <dd className="font-medium capitalize">{data.environment}</dd>
              
              <dt className="text-gray-600">Last Update:</dt>
              <dd className="font-medium">{formattedTime}</dd>
            </dl>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Cache Management</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Clear Entire Cache</h3>
              <p className="text-sm text-gray-500 mb-2">
                This will remove all cached items. Use with caution!
              </p>
              <button
                onClick={handleClearCache}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Clear Cache
              </button>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Invalidate Cache Tag</h3>
              <p className="text-sm text-gray-500 mb-2">
                Remove all cached items with a specific tag.
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Enter tag name"
                  className="border rounded px-3 py-2 flex-grow"
                />
                <button
                  onClick={handleInvalidateTag}
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Invalidate
                </button>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">Example tags: products, users, content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Common Cache Tags</h2>
        <div className="flex flex-wrap gap-2">
          {['products', 'users', 'content', 'settings', 'navigation'].map((commonTag) => (
            <button
              key={commonTag}
              onClick={() => setTag(commonTag)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
            >
              {commonTag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 