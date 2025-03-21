import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reefq - 3D Jewelry Visualization",
  description: "Professional 3D jewelry visualization and customization platform",
  keywords: ["jewelry", "3D", "visualization", "customization", "SaaS"],
  authors: [{ name: "Reefq Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <main className="min-h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
