"use client";

import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function VerifyEmailPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";

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
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-brand-teal/10 mb-4">
              <Mail className="h-8 w-8 text-brand-teal" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Check your inbox
            </h1>
            <p className="mt-2 text-gray-600">
              We've sent you a verification email. Please check your inbox and
              click the link to verify your email address.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              If you don't see the email, check your spam folder or try
              resending the verification email.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              fullWidth={true}
              className="bg-gray-100 text-gray-800 hover:bg-gray-200"
              variant="outline"
              onClick={() => {
                // Resend verification email logic would go here
                alert("Verification email resent. Please check your inbox.");
              }}
            >
              Resend verification email
            </Button>

            <div className="text-center">
              <Link
                href={`/${lang}/auth/login`}
                className="text-brand-teal hover:text-brand-teal/80 font-medium"
              >
                Back to sign in
              </Link>
            </div>
          </div>
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
