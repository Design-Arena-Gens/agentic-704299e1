import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Event Management System",
  description: "Create and manage events with AI assistance"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-6">
              <Link href="/" className="text-xl font-semibold text-brand-700">
                EventMgmt
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/" className="text-sm text-slate-700 hover:text-brand-700">
                  Home
                </Link>
                <Link href="/admin" className="text-sm text-slate-700 hover:text-brand-700">
                  Admin
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
          </main>
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
              ? {new Date().getFullYear()} EventMgmt. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

