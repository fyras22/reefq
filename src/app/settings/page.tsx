"use client";

import { Button, Card, Select } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setIsClient(true);

    if (!isLoading && !user) {
      window.location.href = "/auth/login";
    }
  }, [user, isLoading]);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "ar", label: "العربية" },
  ];

  const themeOptions = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="border-b border-gray-200">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Settings</h1>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-dark-gray hover:text-brand-teal"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-dark-gray hover:text-brand-teal"
            >
              Profile
            </Link>
            <Link href="/settings" className="text-brand-teal hover:underline">
              Settings
            </Link>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-8">
          <Card variant="outline" padding="lg">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Appearance</h3>
                <Card variant="outline" padding="md">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Theme
                      </label>
                      <Select
                        options={themeOptions}
                        value={theme}
                        onChange={(e) =>
                          setTheme(
                            e.target.value as "light" | "dark" | "system"
                          )
                        }
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Language Preferences
                </h3>
                <Card variant="outline" padding="md">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Display Language
                      </label>
                      <Select
                        options={languageOptions}
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Notification Settings
                </h3>
                <Card variant="outline" padding="md">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Email Notifications
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-brand-teal border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Marketing Updates
                      </label>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-brand-teal border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        New Feature Announcements
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-brand-teal border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Account Actions</h3>
                <Card variant="outline" padding="md">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-medium-gray mb-2">
                        Delete your account and all associated data.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-error border-error hover:bg-error hover:text-white"
                        onClick={() =>
                          alert(
                            "This action would permanently delete your account."
                          )
                        }
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
