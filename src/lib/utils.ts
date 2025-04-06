import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistance, formatRelative } from 'date-fns';
import { createHash } from 'crypto';

/**
 * Combines class names using clsx and tailwind-merge for optimal class generation
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date in a human-readable format
 * @param date - Date to format
 * @param formatString - Format string (e.g. 'yyyy-MM-dd')
 */
export function formatDate(
  date: Date | string | number,
  formatString: string = 'PPP'
): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  return format(dateObj, formatString);
}

/**
 * Retrieves a nested value from an object using a path string
 * @param obj - Object to retrieve value from
 * @param path - Path to the value, using dot notation (e.g. 'user.address.city')
 * @param defaultValue - Value to return if path doesn't exist
 */
export function get<T>(obj: any, path: string, defaultValue: T = undefined as unknown as T): T {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  
  return (result === undefined || result === null) ? defaultValue : result as T;
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Truncates text to a specified length and adds ellipsis (alias for truncate)
 */
export const truncateText = truncate;

/**
 * Generates a random ID
 */
export function generateId(length: number = 6): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generates a random string of specified length
 */
export function getRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Creates a promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Alias for sleep
 */
export const delay = sleep;

/**
 * Formats a price with the specified currency and locale
 * @param price - Price value in smallest currency unit (e.g. cents)
 * @param options - Formatting options
 */
export function formatPrice(
  price: number,
  options: {
    currency?: string;
    locale?: string;
    decimals?: number;
    divisor?: number;
  } = {}
) {
  const {
    currency = 'USD',
    locale = 'en-US',
    decimals = 2,
    divisor = 100,
  } = options;
  
  // Convert from cents to dollars if needed
  const normalizedPrice = divisor !== 1 ? price / divisor : price;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(normalizedPrice);
}

/**
 * Formats a number with the specified locale and options
 */
export function formatNumber(
  num: number,
  options: {
    locale?: string;
    style?: 'decimal' | 'percent' | 'unit';
    unit?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    locale = 'en-US',
    style = 'decimal',
    unit,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;
  
  return new Intl.NumberFormat(locale, {
    style,
    ...(unit && { unit }),
    ...(minimumFractionDigits !== undefined && { minimumFractionDigits }),
    ...(maximumFractionDigits !== undefined && { maximumFractionDigits }),
  }).format(num);
}

/**
 * Debounces a function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttles a function
 * @param fn - Function to throttle
 * @param limit - Minimum time between invocations
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastRun = 0;
  
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    
    if (now - lastRun >= limit) {
      lastRun = now;
      fn.apply(this, args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastRun = Date.now();
        fn.apply(this, args);
      }, limit);
    }
  };
}

/**
 * Memoizes a function to cache its results
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Generates a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
    .replace(/\--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Generates an array of numbers from start to end (inclusive)
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Alias for get function with a more descriptive name
 */
export const getNestedValue = get;

/**
 * Returns a relative time string (e.g. "2 days ago")
 */
export function getRelativeTime(date: Date | string | number): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Returns a relative date (e.g. "yesterday", "last Friday", "today")
 */
export function getRelativeDate(date: Date | string | number): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  return formatRelative(dateObj, new Date());
}

/**
 * Checks if a value is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if the client is on a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Creates a deep clone of an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Extracts specified fields from an object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}

/**
 * Omits specified fields from an object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Groups array items by a key or key function
 */
export function groupBy<T>(
  arr: T[],
  keyOrFn: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return arr.reduce((result, item) => {
    const key = typeof keyOrFn === 'function'
      ? keyOrFn(item)
      : String(item[keyOrFn]);
    
    (result[key] = result[key] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Creates a cache key from a set of parameters
 */
export function createCacheKey(obj: Record<string, any>): string {
  const sortedEntries = Object.entries(obj)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    
  return sortedEntries
    .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
    .join('|');
}

/**
 * Applies containment styles to an element to reduce CLS
 * This should be called on elements that may cause layout shifts
 */
export function applyContainmentStyles(element: HTMLElement) {
  if (!element) return;
  
  element.style.containIntrinsicSize = 'auto';
  element.style.contain = 'layout paint style';
}

/**
 * Format currency value
 * @param value Amount to format
 * @param currency Currency code
 * @param locale Locale for formatting
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Convert a string to kebab-case
 * @param str String to convert
 */
export function toKebabCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Convert a string to camelCase
 * @param str String to convert
 */
export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[-_\s](.)/g, (_, group) => group.toUpperCase());
}

/**
 * Calculate reading time for a text
 * @param text Text to calculate reading time for
 * @param wordsPerMinute Reading speed in words per minute
 */
export function getReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Check if the code is running on the client
 */
export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;

/**
 * Get the current URL in a server component
 * @param requestOrHeaders Request object or headers
 */
export function getURL(requestOrHeaders?: Request | Headers): string {
  let host = '';
  let protocol = 'https:';

  if (requestOrHeaders) {
    const headers = requestOrHeaders instanceof Request ? requestOrHeaders.headers : requestOrHeaders;
    host = headers.get('host') || headers.get('x-forwarded-host') || '';
    protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http:' : 'https:';
  } else if (isClient) {
    host = window.location.host;
    protocol = window.location.protocol;
  } else {
    host = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || 'localhost:3000';
    protocol = host.includes('localhost') ? 'http:' : 'https:';
  }

  return `${protocol}//${host}`;
}

/**
 * Check if the current environment is development
 */
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';

/**
 * Generate a slug from a string
 * @param str String to generate slug from
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Deep merge two objects
 * @param target Target object
 * @param source Source object
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          Object.assign(output, { 
            [key]: deepMerge(
              target[key as keyof T] as Record<string, any>, 
              source[key as keyof T] as Record<string, any>
            ) 
          });
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output as T;
}

/**
 * Check if a value is an object
 * @param item Value to check
 */
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Get a random integer between min and max
 * @param min Minimum value
 * @param max Maximum value
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Chunk an array into multiple arrays
 * @param array Array to chunk
 * @param size Size of each chunk
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Convert bytes to human-readable format
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Extract domain from a URL
 * @param url URL to extract domain from
 */
export function extractDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch (e) {
    return '';
  }
}

/**
 * Check if a URL is external
 * @param url URL to check
 * @param currentDomain Current domain
 */
export function isExternalURL(url: string, currentDomain?: string): boolean {
  if (!url.startsWith('http')) return false;
  const domain = extractDomain(url);
  if (!domain) return false;
  
  const current = currentDomain || (isClient ? window.location.hostname : '');
  return domain !== current;
}

/**
 * Escape HTML special characters
 * @param html HTML string to escape
 */
export function escapeHTML(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Wait for a condition to be true
 * @param condition Condition function
 * @param timeout Timeout in milliseconds
 * @param interval Check interval in milliseconds
 */
export function waitFor(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkCondition = () => {
      if (condition()) {
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        resolve(false);
      } else {
        setTimeout(checkCondition, interval);
      }
    };
    
    checkCondition();
  });
}

/**
 * Serialize form data to object
 * @param formData Form data to serialize
 */
export function formDataToObject(formData: FormData): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};
  
  // Convert to array first to avoid the iterator issue
  Array.from(formData.entries()).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          (result[key] as string[]).push(value);
        } else {
          result[key] = [result[key] as string, value];
        }
      } else {
        result[key] = value;
      }
    }
  });
  
  return result;
}

/**
 * Parse query string to object
 * @param query Query string to parse
 */
export function parseQueryString(query: string): Record<string, string> {
  return Object.fromEntries(
    query
      .substring(1)
      .split('&')
      .map((param) => {
        const [key, value] = param.split('=');
        return [key, decodeURIComponent(value || '')];
      })
  );
}

/**
 * Get browser locale
 * @param defaultLocale Default locale
 */
export function getBrowserLocale(defaultLocale: string = 'en-US'): string {
  if (isServer) return defaultLocale;
  
  try {
    const locale = navigator.language || defaultLocale;
    return locale;
  } catch (error) {
    return defaultLocale;
  }
}

/**
 * Safely parse JSON without throwing errors
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return fallback;
  }
}

/**
 * Check if a value is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
} 