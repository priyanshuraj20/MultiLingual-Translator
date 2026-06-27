"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [showBanner, setShowBanner] = useState(true);

  if (isLanding) {
    return (
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto h-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-white transition-colors group">
              <div className="w-8 h-8 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLuKVSk3_84_5GQ6VkK2082k2yi4ZiupJd9HG6EFX_8ZdPjwMZ0pLB9YafMoTihOJwySlqPC8GR_ysGt6qanmSuH3t0OgpcAsHo_JkfRvhqb2XSZOGNqnsNNnHc4yj2BKgPqtrsSHLUsfnNcL6VIJQFqaFU51fidPBqq50VrfNldOBJEFxfdb-9Byi7HcQqBxZpgL9YnhDIkarAFkZnrdwPiDUPTpeQziyaJdyrhHuLsyC_MvFuOTOSzWw" 
                  alt="Voxa Logo" 
                  className="w-5 h-5 object-contain"
                />
              </div>
              <span className="font-bold text-white font-headline-md">Voxa</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 font-sans">
              <Link href="/workspace" className="text-sm text-[#cbc3d7] hover:text-white transition-colors">
                Platform
              </Link>
              <Link href="/technology" className="text-sm text-[#cbc3d7] hover:text-white transition-colors">
                Solutions
              </Link>
              <Link href="/technology" className="text-sm text-[#cbc3d7] hover:text-white transition-colors">
                API Reference
              </Link>
              <Link href="/design-system" className="text-sm text-[#cbc3d7] hover:text-white transition-colors">
                Design System
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/workspace" className="text-sm text-[#cbc3d7] hover:text-white transition-colors px-3 py-1.5 font-medium">
              Log In
            </Link>
            <Link href="/workspace" className="bg-[#8b5cf6] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#7c3aed] transition-colors shadow-lg shadow-[#8b5cf6]/15">
              Launch Workspace
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard Header (Workspace, History, Tech, Design System)
  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
      {/* Top Banner Alert from Stitch */}
      {showBanner && (
        <div className="bg-gradient-to-r from-[#8b5cf6]/20 to-[#3b82f6]/10 border-b border-[#8b5cf6]/20 px-6 py-2.5 flex items-center justify-between z-20 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#8b5cf6]/20 flex items-center justify-center text-[#d0bcff]">
              <span className="material-symbols-outlined text-base">download_for_offline</span>
            </div>
            <p className="text-[12px] md:text-sm font-medium text-[#e9ddff]">
              Sync <span className="font-bold text-white">Voxa AI</span> Chrome extension to enable cross-tab translation in your browser.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[12px] md:text-sm text-primary hover:underline font-bold flex items-center gap-1">
              Download &amp; Sync Extension
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </button>
            <button 
              onClick={() => setShowBanner(false)}
              className="text-[#cbc3d7] hover:text-white transition-colors flex items-center justify-center p-0.5"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header Menu */}
      <header className="h-20 flex justify-between items-center px-6 border-b border-white/5 z-10 bg-black/40 backdrop-blur-xl">
        {/* Left Side Pill */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#2c2832]/40 rounded-full px-4 py-1.5 border border-white/10 backdrop-blur-sm select-none">
            <span className="font-label-md text-[11px] text-[#cbc3d7] uppercase tracking-wider">Browser Source</span>
            <span className="material-symbols-outlined mx-2 text-[#8b5cf6]/50 text-sm select-none">east</span>
            <span className="font-label-md text-[11px] text-[#d0bcff] font-bold uppercase tracking-wider">Active Layer</span>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-8 font-mono text-xs">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] text-[#cbc3d7]/50 uppercase tracking-[0.2em] font-bold">Sync Status</span>
            <span className="text-[#d0bcff] font-bold text-sm">Connected</span>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] text-[#cbc3d7]/50 uppercase tracking-[0.2em] font-bold">Extension Version</span>
            <span className="text-[#adc6ff] font-bold text-sm">v2.4.0</span>
          </div>
          <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-label-md text-xs px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-lg shadow-[#8b5cf6]/20 font-bold">
            Settings
          </button>
        </div>
      </header>
    </div>
  );
}
