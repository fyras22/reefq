import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { z } from 'zod';

/**
 * Authentication configuration for NextAuth
 */
export const authConfig: NextAuthOptions = {
  // Use secure cookies in production
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  
  // Pages for custom authentication flows
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    signOut: '/auth/logout',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/register',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    // Add custom fields to the JWT
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      
      return token;
    },
    
    // Add custom fields to the session
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      
      return session;
    },
  },
  
  // Configure authentication providers
  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '12345-placeholder-clientid.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder-secret',
      allowDangerousEmailAccountLinking: true,
    }),

    // GitHub OAuth provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || 'placeholder-clientid',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder-secret',
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Email/password credentials provider
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      
      async authorize(credentials) {
        // Validate credentials
        const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6)
          })
          .safeParse(credentials);
          
        if (!parsedCredentials.success) {
          return null;
        }
        
        const { email, password } = parsedCredentials.data;
        
        // This is a mock user for demonstration
        if (email === 'admin@example.com' && password === 'password123') {
          return {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin',
          };
        }
        
        // For non-admin demo user
        if (email === 'user@example.com' && password === 'password123') {
          return {
            id: '2',
            email: 'user@example.com',
            name: 'Regular User',
            role: 'user',
          };
        }
        
        return null;
      },
    }),
  ],
}; 