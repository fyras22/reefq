"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const router = useRouter();
  const { signUp, signInWithOAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp(data.email, data.password, {
        name: data.name,
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        router.push(`/${lang}/auth/verify-email`);
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithOAuth(provider);
      // OAuth redirect will happen automatically
    } catch (error: any) {
      setError(error.message || "Something went wrong with OAuth sign in");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-center">
          <Link href={`/${lang}`} className="flex items-center">
            <span className="text-brand-teal text-2xl font-bold">ReefQ</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create an account
            </h1>
            <p className="mt-2 text-gray-600">
              Or{" "}
              <Link
                href={`/${lang}/auth/login`}
                className="text-brand-teal hover:text-brand-teal/80 font-medium"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full name"
              type="text"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email address"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirm password"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button
              type="submit"
              fullWidth={true}
              loading={isLoading}
              className="bg-brand-teal hover:bg-brand-teal/90 text-white font-medium"
            >
              Create Account
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300"
                onClick={() => handleOAuthSignIn("google")}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-gray-300"
                onClick={() => handleOAuthSignIn("facebook")}
              >
                Facebook
              </Button>
            </div>
          </form>

          <p className="text-xs text-center text-gray-500 mt-8">
            By creating an account, you agree to our{" "}
            <Link
              href={`/${lang}/terms`}
              className="text-brand-teal hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href={`/${lang}/privacy`}
              className="text-brand-teal hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ReefQ. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href={`/${lang}/privacy`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Privacy
              </Link>
              <Link
                href={`/${lang}/terms`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Terms
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
