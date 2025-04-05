import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

// For demo purposes, we'll use a mock admin user
const mockAdminUser = {
  id: "1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  password: "password123", // In production, this would be hashed
};

const handler = NextAuth({
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validatedCredentials = z
            .object({
              email: z.string().email(),
              password: z.string().min(3), // Lowered for testing
            })
            .parse(credentials);

          console.log("Login attempt:", validatedCredentials.email);

          // For demo purposes, we'll use mock admin user
          if (validatedCredentials.email === mockAdminUser.email) {
            if (validatedCredentials.password === mockAdminUser.password) {
              console.log("Login successful for admin");
              return {
                id: mockAdminUser.id,
                name: mockAdminUser.name,
                email: mockAdminUser.email,
                role: mockAdminUser.role,
              };
            }
          }

          console.log("Login failed: invalid credentials");
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
});

// Export the handler functions explicitly
export const GET = handler.GET;
export const POST = handler.POST; 