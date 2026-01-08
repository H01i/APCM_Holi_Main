import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APCM Platform",
  description: "Advanced Primary Care Management workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900 antialiased`}
      >
        <div className="flex min-h-screen">
          <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-900 text-slate-50">
            <div className="px-6 py-6 text-xl font-semibold tracking-tight">
              APCM
            </div>
            <nav className="flex flex-col gap-1 px-4 pb-8">
              {[
                { href: "/", label: "Dashboard" },
                { href: "/patients", label: "Patients" },
                { href: "/care-plans", label: "Care Plans" },
                { href: "/settings", label: "Settings" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-800 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 px-8 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
