"use client";

import { Button, Card, Input } from "@/components/ui";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useAuth } from "@/providers/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithOAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Get the redirectUrl from the query parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get("redirectUrl");
    setRedirectUrl(redirect);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log("[Login] Attempting to sign in with:", data.email);
      const result = await signIn(data.email, data.password);

      if (result.error) {
        console.error("[Login] Authentication failed:", result.error.message);
        setAuthError(result.error.message);
      } else {
        console.log(
          "[Login] Sign in successful, redirecting to:",
          redirectUrl || "/dashboard"
        );
        // Set flag to show welcome message on dashboard
        if (typeof window !== "undefined") {
          try {
            console.log("[Login] Setting justLoggedIn flag in sessionStorage");
            sessionStorage.setItem("justLoggedIn", "true");
          } catch (e) {
            console.error("[Login] Error setting sessionStorage flag:", e);
          }
        }
        // Force hard navigation to dashboard to ensure proper session handling
        window.location.href = redirectUrl || "/dashboard";
      }
    } catch (error: any) {
      console.error("[Login] Exception during sign in:", error);
      setAuthError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log(`[Login] Initiating ${provider} OAuth flow`);
      await signInWithOAuth(provider);
      // OAuth redirect will happen automatically
    } catch (error: any) {
      console.error(`[Login] ${provider} OAuth error:`, error);
      setAuthError(
        error.message || `Something went wrong with ${provider} sign in`
      );
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async () => {
    if (!email || !email.includes("@")) {
      setAuthError("Please enter a valid email address for magic link");
      return;
    }

    setMagicLinkLoading(true);
    setAuthError(null);

    try {
      // Implement magic link sign-in logic here
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      setMagicLinkSent(true);
    } catch (error: any) {
      setAuthError(error.message || "Error sending magic link");
    } finally {
      setMagicLinkLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-100 to-white dark:from-neutral-800 dark:to-neutral-900">
      {/* Header */}
      <header className="py-6 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-800/80 dark:border-neutral-800">
        <div className="container mx-auto px-4 flex justify-center relative">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="ReefQ Logo" className="h-20 w-auto" />
          </Link>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <ThemeSwitch />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card
          variant="elevated"
          className="w-full max-w-md bg-white text-neutral-800 dark:bg-neutral-800 dark:text-white"
        >
          {magicLinkSent ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[--color-primary-teal]/10 mb-4">
                <Mail className="h-8 w-8 text-[--color-primary-teal]" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Check your inbox
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                We've sent a magic link to <strong>{email}</strong>
              </p>
              <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                Click the link in the email to sign in to your account.
              </p>
              <Button
                onClick={() => setMagicLinkSent(false)}
                variant="link"
                className="mt-6"
              >
                Use a different method
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                  Welcome back
                </h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                  Sign in to your account to continue
                </p>
              </div>

              {authError && (
                <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm mb-6 border border-red-100 dark:bg-red-900/20 dark:p-4 dark:text-red-400 dark:border-red-800/50">
                  <p>{authError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    className="bg-white border-neutral-300 text-neutral-800 placeholder:text-neutral-400 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-400"
                    {...register("email")}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-[--color-primary-teal] hover:text-[--color-primary-teal]/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    className="bg-white border-neutral-300 text-neutral-800 placeholder:text-neutral-400 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-400"
                    {...register("password")}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={isLoading}
                    className="w-full border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-neutral-700 dark:text-white">
                      Google
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuthSignIn("facebook")}
                    disabled={isLoading}
                    className="w-full border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        fill="#1877F2"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    <span className="text-neutral-700 dark:text-white">
                      Facebook
                    </span>
                  </Button>
                </div>
              </div>

              <Button
                variant="link"
                onClick={handleMagicLinkSignIn}
                disabled={magicLinkLoading}
                className="w-full mt-4 text-[--color-primary-teal]"
              >
                {magicLinkLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-[--color-primary-teal]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending magic link...
                  </span>
                ) : (
                  "Sign in with magic link"
                )}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-[--color-primary-teal] hover:text-[--color-primary-teal]/80"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p>© {new Date().getFullYear()} ReefQ. All rights reserved.</p>
      </footer>
    </div>
  );
}
