import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AccessibilityProvider from "@/components/accessibility-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ConnectionProvider } from "@/components/connection-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "More & More Network",
  description:
    "Connecting real estate professionals with clients and opportunities",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Using system fonts to avoid external network dependencies and improve initial load time */}
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <ConnectionProvider>
              <AccessibilityProvider>{children}</AccessibilityProvider>
              <Toaster />
            </ConnectionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
