"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(data.email, data.password);
      if (result.error) {
        setError(result.error.message);
      }
      // Successful login is handled by the AuthProvider
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
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
              Sign in to your account
            </h1>
            <p className="mt-2 text-gray-600">
              Or{" "}
              <Link
                href={`/${lang}/auth/register`}
                className="text-brand-teal hover:text-brand-teal/80 font-medium"
              >
                create a new account
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
              label="Email address"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />

            <div>
              <Input
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
              />
              <div className="mt-1 text-right">
                <Link
                  href={`/${lang}/auth/forgot-password`}
                  className="text-sm text-brand-teal hover:text-brand-teal/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth={true}
              loading={isLoading}
              className="bg-brand-teal hover:bg-brand-teal/90 text-white font-medium"
            >
              Sign in
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300"
                onClick={() => {
                  // Handle Google sign in
                }}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-gray-300"
                onClick={() => {
                  // Handle Apple sign in
                }}
              >
                Apple
              </Button>
            </div>
          </form>
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
