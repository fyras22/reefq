"use client";

import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthTestPage() {
  const { user, session, isLoading, signOut } = useAuth();
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [isCheckingApi, setIsCheckingApi] = useState(false);

  async function checkApiStatus() {
    setIsCheckingApi(true);
    try {
      const response = await fetch("/api/auth/status");
      const data = await response.json();
      setApiStatus(data);
    } catch (error) {
      setApiStatus({ error: "Failed to fetch API status" });
    } finally {
      setIsCheckingApi(false);
    }
  }

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-[#f9f7f4]">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>

        <div className="space-y-6">
          <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="font-semibold mb-2">Auth Provider Status:</h2>
            {isLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Authenticated:</span>{" "}
                  <span className={user ? "text-green-600" : "text-red-600"}>
                    {user ? "Yes" : "No"}
                  </span>
                </div>
                {user && (
                  <>
                    <div>
                      <span className="font-medium">User ID:</span> {user.id}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {user.user_metadata?.name || "Not set"}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">API Status:</h2>
              <button
                onClick={checkApiStatus}
                disabled={isCheckingApi}
                className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                {isCheckingApi ? "Checking..." : "Refresh"}
              </button>
            </div>
            {apiStatus ? (
              <pre className="text-xs bg-gray-800 text-white p-3 rounded overflow-auto">
                {JSON.stringify(apiStatus, null, 2)}
              </pre>
            ) : (
              <div className="text-gray-500">Checking API status...</div>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-pharaonic-gold text-black rounded-md hover:bg-pharaonic-gold/90 transition-colors"
            >
              Go to Login
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-pharaonic-gold text-black rounded-md hover:bg-pharaonic-gold/90 transition-colors"
            >
              Go to Register
            </Link>
            {user && (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
