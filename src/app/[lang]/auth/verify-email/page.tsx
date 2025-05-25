"use client";

import { supabase } from "@/lib/supabase";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);

    try {
      // Get current user from session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        console.error("No email found in session to resend verification");
        setError("No email found. Please try logging in again.");
        return;
      }

      // Resend verification email
      console.log(
        "Attempting to resend verification email to:",
        session.user.email
      );
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: session.user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        console.error("Error resending verification email:", error);
        setError(error.message);
        return;
      }

      // Success
      console.log("Verification email resent successfully");
      setResendSuccess(true);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error("Exception resending verification email:", err);
      setError(err.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

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

        {/* Content container */}
        <div className="flex-1 flex items-center justify-center px-8 py-6">
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-pharaonic-gold/10 mb-6">
                <Mail className="h-8 w-8 text-pharaonic-gold" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Check your inbox
              </h1>
              <p className="text-gray-600">
                We've sent you a verification email. Please check your inbox and
                click the link to verify your email address.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                If you don't see the email, check your spam folder or try
                resending the verification email.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-md bg-red-50 p-4 text-red-500 text-sm border border-red-100">
                <p>{error}</p>
              </div>
            )}

            {resendSuccess && (
              <div className="mt-6 rounded-md bg-green-50 p-4 text-green-700 text-sm border border-green-100">
                <p>Verification email resent successfully.</p>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md border border-gray-300 transition-colors"
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
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
                    Resending email...
                  </span>
                ) : (
                  "Resend verification email"
                )}
              </button>

              <div className="text-center">
                <Link
                  href={`/${lang}/auth/login`}
                  className="text-pharaonic-gold hover:underline font-medium"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
