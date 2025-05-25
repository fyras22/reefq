"use client";

import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { requestPasswordReset, isLoading, error, clearError } =
    useSupabaseAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    clearError();
    setLocalError(null);

    try {
      console.log("Requesting password reset for:", data.email);

      const result = await requestPasswordReset(data.email);

      if (!result.success) {
        setLocalError(result.error?.message || "Failed to send reset link");
        return;
      }

      // Success! Show success message
      console.log("Password reset email sent successfully");
      setSuccess(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setLocalError(error.message || "Something went wrong");
    }
  };

  // Display error from hook or local error
  const displayError = error || localError;

  return (
    <div className="min-h-screen flex bg-[#f9f7f4]">
      {/* Left side with background image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/branding/branding5.jpg"
          alt="ReefQ Jewelry"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Logo header */}
        <div className="px-8 py-6">
          <Link href={`/${lang}`} className="inline-block">
            <Image
              src="/images/logo/logo-light.png"
              alt="ReefQ"
              width={120}
              height={40}
            />
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-8 py-6">
          <div className="w-full max-w-md">
            {success ? (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-pharaonic-gold/10 mb-6">
                  <Mail className="h-8 w-8 text-pharaonic-gold" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Check your inbox
                </h2>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Click the link in the email to reset your password.
                </p>
                <div className="mt-6">
                  <Link
                    href={`/${lang}/auth/login`}
                    className="text-pharaonic-gold hover:underline font-medium"
                  >
                    Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Reset your password
                  </h1>
                  <p className="text-gray-600">
                    Enter your email and we'll send you a link to reset your
                    password
                  </p>
                </div>

                {displayError && (
                  <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm mb-6 border border-red-100">
                    <p>{displayError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pharaonic-gold focus:border-pharaonic-gold"
                      placeholder="Enter your email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-pharaonic-gold hover:bg-pharaonic-gold/90 text-black font-medium py-2.5 px-4 rounded-md mt-2 transition-colors"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
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
                        Sending reset link...
                      </span>
                    ) : (
                      "Send reset link"
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <Link
                      href={`/${lang}/auth/login`}
                      className="text-pharaonic-gold hover:underline font-medium"
                    >
                      Back to sign in
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
