import { getCookie, setCookie } from 'cookies-next';
import { v4 as uuidv4 } from 'uuid';

// Types for analytics events
export type EventCategory = 
  | 'user' 
  | 'page' 
  | 'interaction' 
  | 'commerce' 
  | 'error' 
  | 'performance';

export type EventAction = 
  | 'view' 
  | 'click' 
  | 'hover' 
  | 'scroll' 
  | 'submit' 
  | 'purchase' 
  | 'add_to_cart' 
  | 'remove_from_cart' 
  | 'error' 
  | 'load' 
  | 'api_call';

// Core analytics event interface
export interface AnalyticsEvent {
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  pageUrl: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

// Analytics provider interface
export interface AnalyticsProvider {
  init: () => Promise<void>;
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
  trackPageView: (url: string, metadata?: Record<string, any>) => Promise<void>;
  trackError: (error: Error, metadata?: Record<string, any>) => Promise<void>;
  trackPerformance: (metrics: Record<string, number>) => Promise<void>;
  identify: (userId: string, traits?: Record<string, any>) => Promise<void>;
}

// Vercel Analytics provider
export class VercelAnalyticsProvider implements AnalyticsProvider {
  async init() {
    // Vercel Analytics is automatically initialized via the <Analytics /> component
  }

  async trackEvent(event: AnalyticsEvent) {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', {
        name: `${event.category}:${event.action}`,
        data: {
          ...event,
          timestamp: event.timestamp || Date.now(),
        },
      });
    }
  }

  async trackPageView(url: string, metadata?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.va) {
      window.va('pageview', { 
        path: url, 
        ...metadata 
      });
    }
  }

  async trackError(error: Error, metadata?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', {
        name: 'error',
        data: {
          message: error.message,
          stack: error.stack,
          ...metadata,
        },
      });
    }
  }

  async trackPerformance(metrics: Record<string, number>) {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', {
        name: 'performance',
        data: metrics,
      });
    }
  }

  async identify(userId: string, traits?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', {
        name: 'user:identify',
        data: {
          userId,
          ...traits,
        },
      });
    }
  }
}

// Custom in-house analytics (could send to your own API endpoint)
export class CustomAnalyticsProvider implements AnalyticsProvider {
  private apiEndpoint: string;
  
  constructor(apiEndpoint = '/api/analytics') {
    this.apiEndpoint = apiEndpoint;
  }

  async init() {
    // No initialization needed
  }

  async trackEvent(event: AnalyticsEvent) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'event',
          data: event,
        }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async trackPageView(url: string, metadata?: Record<string, any>) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'pageview',
          data: {
            url,
            timestamp: Date.now(),
            sessionId: getOrCreateSessionId(),
            ...metadata,
          },
        }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  async trackError(error: Error, metadata?: Record<string, any>) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'error',
          data: {
            message: error.message,
            stack: error.stack,
            timestamp: Date.now(),
            sessionId: getOrCreateSessionId(),
            ...metadata,
          },
        }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to track error:', error);
    }
  }

  async trackPerformance(metrics: Record<string, number>) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'performance',
          data: {
            metrics,
            timestamp: Date.now(),
            sessionId: getOrCreateSessionId(),
          },
        }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to track performance:', error);
    }
  }

  async identify(userId: string, traits?: Record<string, any>) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'identify',
          data: {
            userId,
            traits,
            timestamp: Date.now(),
            sessionId: getOrCreateSessionId(),
          },
        }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }
}

// Analytics client that coordinates multiple providers
export class AnalyticsClient {
  private providers: AnalyticsProvider[] = [];
  private isInitialized = false;

  constructor(providers: AnalyticsProvider[] = []) {
    this.providers = providers;
  }

  async init() {
    if (this.isInitialized) return;

    await Promise.all(this.providers.map(provider => provider.init()));
    this.isInitialized = true;
  }

  async trackEvent(
    category: EventCategory, 
    action: EventAction, 
    label?: string, 
    value?: number, 
    metadata?: Record<string, any>
  ) {
    if (!this.isInitialized) await this.init();

    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      metadata,
      timestamp: Date.now(),
      sessionId: getOrCreateSessionId(),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    };

    await Promise.all(this.providers.map(provider => provider.trackEvent(event)));
  }

  async trackPageView(url: string, metadata?: Record<string, any>) {
    if (!this.isInitialized) await this.init();

    await Promise.all(this.providers.map(provider => 
      provider.trackPageView(url, metadata)
    ));
  }

  async trackError(error: Error, metadata?: Record<string, any>) {
    if (!this.isInitialized) await this.init();

    await Promise.all(this.providers.map(provider => 
      provider.trackError(error, metadata)
    ));
  }

  async trackPerformance(metrics: Record<string, number>) {
    if (!this.isInitialized) await this.init();

    await Promise.all(this.providers.map(provider => 
      provider.trackPerformance(metrics)
    ));
  }

  async identify(userId: string, traits?: Record<string, any>) {
    if (!this.isInitialized) await this.init();

    await Promise.all(this.providers.map(provider => 
      provider.identify(userId, traits)
    ));
  }
}

// Helper to get or create a session ID
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  const SESSION_COOKIE_NAME = 'analytics_session_id';
  const existingSessionId = getCookie(SESSION_COOKIE_NAME);

  if (existingSessionId) {
    return existingSessionId as string;
  }

  const newSessionId = uuidv4();
  setCookie(SESSION_COOKIE_NAME, newSessionId, {
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    sameSite: 'lax',
  });

  return newSessionId;
}

// Tracking hooks for common events
export function trackClick(
  elementId: string, 
  label?: string, 
  metadata?: Record<string, any>
) {
  return analytics.trackEvent('interaction', 'click', label || elementId, undefined, {
    elementId,
    ...metadata,
  });
}

export function trackFormSubmit(
  formId: string, 
  label?: string, 
  metadata?: Record<string, any>
) {
  return analytics.trackEvent('interaction', 'submit', label || formId, undefined, {
    formId,
    ...metadata,
  });
}

export function trackAddToCart(
  productId: string, 
  price: number, 
  quantity: number = 1, 
  metadata?: Record<string, any>
) {
  return analytics.trackEvent('commerce', 'add_to_cart', productId, price * quantity, {
    productId,
    price,
    quantity,
    ...metadata,
  });
}

export function trackPurchase(
  orderId: string, 
  total: number, 
  products: Array<{ id: string; price: number; quantity: number }>,
  metadata?: Record<string, any>
) {
  return analytics.trackEvent('commerce', 'purchase', orderId, total, {
    orderId,
    products,
    ...metadata,
  });
}

// For server-side usage
export function createServerAnalytics(endpoint: string) {
  return new CustomAnalyticsProvider(endpoint);
}

// Convenience function to track client-side errors
export function setupErrorTracking() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    analytics.trackError(event.error || new Error(event.message), {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    analytics.trackError(error, {
      type: 'unhandledrejection',
      reason: String(event.reason),
    });
  });
}

// Declare global window interface
declare global {
  interface Window {
    va?: (command: string, args?: any) => void;
  }
}

// Create and export the singleton analytics client
export const analytics = new AnalyticsClient([
  new VercelAnalyticsProvider(),
  new CustomAnalyticsProvider(),
]);

// Initialize tracking in client-side code
export function initAnalytics(userId?: string) {
  if (typeof window === 'undefined') return;

  // Initialize analytics
  analytics.init();

  // Set up error tracking
  setupErrorTracking();

  // Identify user if available
  if (userId) {
    analytics.identify(userId);
  }

  // Track initial page view
  analytics.trackPageView(window.location.href);
} 