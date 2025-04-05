'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, initAnalytics } from '@/lib/analytics';
import { useSession } from 'next-auth/react';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Analytics Provider Component
 * 
 * Initializes analytics tracking and sets up page view tracking
 * Place this component high in your component tree, typically in layout.tsx
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  // Initialize analytics on mount
  useEffect(() => {
    // Initialize with user ID if available
    initAnalytics(session?.user?.id);
  }, [session?.user?.id]);
  
  // Track page views when route changes
  useEffect(() => {
    if (!pathname) return;
    
    // Create URL with search params
    const url = searchParams?.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    
    // Track page view with metadata
    analytics.trackPageView(url, {
      pathname,
      searchParams: Object.fromEntries(searchParams?.entries() || []),
      title: document.title,
    });
  }, [pathname, searchParams]);
  
  return <>{children}</>;
}

/**
 * Higher-order component to track component mount events
 * @param Component The component to wrap
 * @param componentName Name of the component for tracking
 */
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function WrappedComponent(props: P) {
    useEffect(() => {
      analytics.trackEvent('interaction', 'view', componentName);
      
      return () => {
        // Optional: track component unmount
        // analytics.trackEvent('interaction', 'unmount', componentName);
      };
    }, []);
    
    return <Component {...props} />;
  };
}

/**
 * Hook to track component render events
 * @param componentName Name of the component for tracking
 */
export function useAnalyticsTracking(componentName: string) {
  useEffect(() => {
    analytics.trackEvent('interaction', 'view', componentName);
    
    return () => {
      // Optional: track component unmount
      // analytics.trackEvent('interaction', 'unmount', componentName);
    };
  }, [componentName]);
}

/**
 * Hook that returns tracking functions for a specific component
 * @param componentName Name of the component for tracking
 */
export function useComponentTracking(componentName: string) {
  return {
    trackEvent: (action: string, label?: string, value?: number, metadata?: Record<string, any>) => {
      analytics.trackEvent('interaction', action as any, label || componentName, value, {
        componentName,
        ...metadata,
      });
    },
    trackClick: (elementId: string, metadata?: Record<string, any>) => {
      analytics.trackEvent('interaction', 'click', elementId, undefined, {
        componentName,
        elementId,
        ...metadata,
      });
    },
    trackSubmit: (formId: string, metadata?: Record<string, any>) => {
      analytics.trackEvent('interaction', 'submit', formId, undefined, {
        componentName,
        formId,
        ...metadata,
      });
    },
  };
} 