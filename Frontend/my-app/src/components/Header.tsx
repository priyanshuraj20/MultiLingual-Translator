"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-bold tracking-tight hover:text-white transition-colors">
              LiveLingua
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/workspace" className="text-sm text-secondary hover:text-white transition-colors">
                Platform
              </Link>
              <Link href="/technology" className="text-sm text-secondary hover:text-white transition-colors">
                Solutions
              </Link>
              <Link href="/technology" className="text-sm text-secondary hover:text-white transition-colors">
                API
              </Link>
              <Link href="/design-system" className="text-sm text-secondary hover:text-white transition-colors">
                Design System
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/workspace" className="text-sm text-secondary hover:text-white transition-colors px-3 py-1.5">
              Log In
            </Link>
            <Link href="/workspace" className="bg-white text-black px-4 py-1.5 rounded text-sm font-medium hover:bg-zinc-200 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard Navigation Header
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-14 bg-black border-b border-outline-variant">
      <div className="flex items-center">
        <Link href="/" className="text-lg font-bold tracking-tight text-white hover:text-primary transition-colors">
          LiveLingua
        </Link>
        <span className="text-xs font-mono font-normal opacity-40 ml-2">PRO_DASHBOARD_V3</span>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/workspace"
          className={`text-xs font-medium tracking-wide transition-colors pb-1 border-b-2 ${
            pathname === "/workspace"
              ? "text-primary border-primary font-semibold"
              : "text-on-surface-variant hover:text-white border-transparent"
          }`}
        >
          Workspace
        </Link>
        <Link
          href="/history"
          className={`text-xs font-medium tracking-wide transition-colors pb-1 border-b-2 ${
            pathname === "/history"
              ? "text-primary border-primary font-semibold"
              : "text-on-surface-variant hover:text-white border-transparent"
          }`}
        >
          History
        </Link>
        <Link
          href="/technology"
          className={`text-xs font-medium tracking-wide transition-colors pb-1 border-b-2 ${
            pathname === "/technology"
              ? "text-primary border-primary font-semibold"
              : "text-on-surface-variant hover:text-white border-transparent"
          }`}
        >
          Tech Pipeline
        </Link>
        <Link
          href="/design-system"
          className={`text-xs font-medium tracking-wide transition-colors pb-1 border-b-2 ${
            pathname === "/design-system"
              ? "text-primary border-primary font-semibold"
              : "text-on-surface-variant hover:text-white border-transparent"
          }`}
        >
          Design System
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-widest px-3 py-1 rounded border border-outline text-on-surface-variant hover:border-white hover:text-white transition-colors"
        >
          Sign Out
        </Link>
        <Link
          href="/workspace"
          className="text-[11px] uppercase tracking-widest px-3 py-1 rounded bg-primary text-on-primary font-bold hover:bg-primary/95 transition-colors"
        >
          Start Session
        </Link>
      </div>
    </header>
  );
}
