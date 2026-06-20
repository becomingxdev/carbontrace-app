import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carbon Trace | Understand & Reduce Your Carbon Footprint",
  description: "Calculate, track, and mitigate your personal emissions using real-world baseline models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased min-h-screen flex flex-col`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
          Skip to content
        </a>
        
        <main id="main-content" className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
