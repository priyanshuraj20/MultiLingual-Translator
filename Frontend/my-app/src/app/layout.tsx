import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";

// Load Inter font for readable body copy
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Load Geist Sans font for developer-centric headings
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Load Geist Mono font for code blocks & data feeds
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voxa | Cinematic Precision Workspace",
  description: "Real-time AI Multilingual Speech & Text Translation Platform powered by distributed foundational models.",
  icons: {
    icon: "https://lh3.googleusercontent.com/aida/AP1WRLuKVSk3_84_5GQ6VkK2082k2yi4ZiupJd9HG6EFX_8ZdPjwMZ0pLB9YafMoTihOJwySlqPC8GR_ysGt6qanmSuH3t0OgpcAsHo_JkfRvhqb2XSZOGNqnsNNnHc4yj2BKgPqtrsSHLUsfnNcL6VIJQFqaFU51fidPBqq50VrfNldOBJEFxfdb-9Byi7HcQqBxZpgL9YnhDIkarAFkZnrdwPiDUPTpeQziyaJdyrhHuLsyC_MvFuOTOSzWw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased custom-scrollbar`}
      >
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
