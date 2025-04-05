import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// Import types for type augmentation
import 'next-auth';
import 'next-auth/jwt';

// Add the demo regular user
const mockRegularUser = {
  id: '2',
  name: 'Regular User',
  email: 'user@example.com',
  role: 'user',
  password: '$2a$10$QFX6jLbhJVRz9UgI5x1uMOIsCWQO4QjB7KE1rkRmUfO0qX.oJ89.q', // hashed 'password123'
};

// Create NextAuth handler with our config
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

// Type augmentation for next-auth
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    name: string;
    email: string;
  }
  
  interface Session {
    user: {
      id: string;
      role: string;
      name: string;
      email: string;
    };
  }
}

// Type augmentation for JWT
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

/**
 * This is the main auth module that exports the auth function
 * It's separated from the config to avoid circular dependencies
 */
export const { auth: mainAuth, signIn: mainSignIn, signOut: mainSignOut } = NextAuth(authConfig); 