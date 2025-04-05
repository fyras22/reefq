import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Database
  MONGODB_URI: z.string().min(1),
  
  // Upstash Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Optional services
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),

  // Analytics and monitoring
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  
  // Cache revalidation
  REVALIDATION_SECRET: z.string().min(32).optional(),
  
  // Data encryption
  ENCRYPTION_KEY: z.string().min(32).optional(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

/**
 * You can't destruct `process.env` as a regular object, so we do this for validation purposes.
 * @see https://github.com/vercel/next.js/pull/28356
 */
function getClientValidationSchema() {
  const clientEnv = {};
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('NEXT_PUBLIC_')) {
      // @ts-ignore - we know these are strings
      clientEnv[key] = process.env[key];
    }
  }
  return clientEnv;
}

/**
 * Validate that client-side environment variables are exposed correctly
 */
function validateClientEnv() {
  const clientEnv = getClientValidationSchema();
  const result = clientSchema.safeParse(clientEnv);

  if (!result.success) {
    console.error('❌ Invalid client environment variables:');
    console.error(result.error.issues);
    throw new Error('Invalid client environment variables');
  }
}

/**
 * Validate server environment variables
 */
function validateServerEnv() {
  const result = serverSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid server environment variables:');
    console.error(result.error.issues);
    throw new Error('Invalid server environment variables');
  }
}

/**
 * Validate all environment variables
 * Call this function early in the app initialization (e.g., in the main layout)
 */
export function validateEnv() {
  // Skip validation in test environments
  if (process.env.NODE_ENV === 'test') return;
  
  // Only validate server variables in a server context
  if (typeof window === 'undefined') {
    validateServerEnv();
  }
  
  // Always validate client variables
  validateClientEnv();
} 