"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword(token, data.password);

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess(true);
      }
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
          {success ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Password updated
              </h2>
              <p className="mt-2 text-gray-600">
                Your password has been updated successfully. You can now sign in
                with your new password.
              </p>
              <div className="mt-6">
                <Link
                  href={`/${lang}/auth/login`}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-teal hover:bg-brand-teal/90"
                >
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Reset your password
                </h1>
                <p className="mt-2 text-gray-600">
                  Enter your new password below
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="New password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register("password")}
                />

                <Input
                  label="Confirm new password"
                  type="password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />

                <Button
                  type="submit"
                  fullWidth={true}
                  loading={isLoading}
                  disabled={!token}
                  className="bg-brand-teal hover:bg-brand-teal/90 text-white font-medium"
                >
                  Reset password
                </Button>

                <div className="text-center">
                  <Link
                    href={`/${lang}/auth/login`}
                    className="text-brand-teal hover:text-brand-teal/80 font-medium"
                  >
                    Back to sign in
                  </Link>
                </div>
              </form>
            </>
          )}
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
