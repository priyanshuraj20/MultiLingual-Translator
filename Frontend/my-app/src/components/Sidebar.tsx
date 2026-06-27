"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // If we are on the landing page, we don't display a sidebar
  if (pathname === "/") return null;

  return (
    <aside className="hidden md:flex flex-col h-full w-56 bg-black border-r border-outline-variant p-4 shrink-0">
      {/* Branding Block */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-[16px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            neurology
          </span>
        </div>
        <div>
          <p className="text-[12px] font-bold text-white tracking-tight leading-tight">LiveLingua Pro</p>
          <p className="text-[9px] text-tertiary tracking-widest uppercase leading-none mt-0.5">AI Active</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        <Link
          href="/workspace"
          className={`flex items-center gap-3 px-3 py-2 rounded transition-all group ${
            pathname === "/workspace"
              ? "bg-white/5 text-primary font-bold"
              : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              pathname === "/workspace" ? "text-primary" : "group-hover:text-primary transition-colors"
            }`}
          >
            mic
          </span>
          <span className="text-xs font-medium">Workspace</span>
        </Link>

        <Link
          href="/history"
          className={`flex items-center gap-3 px-3 py-2 rounded transition-all group ${
            pathname === "/history"
              ? "bg-white/5 text-primary font-bold"
              : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              pathname === "/history" ? "text-primary" : "group-hover:text-primary transition-colors"
            }`}
            style={pathname === "/history" ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            history
          </span>
          <span className="text-xs font-medium">History</span>
        </Link>

        <Link
          href="/technology"
          className={`flex items-center gap-3 px-3 py-2 rounded transition-all group ${
            pathname === "/technology"
              ? "bg-white/5 text-primary font-bold"
              : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              pathname === "/technology" ? "text-primary" : "group-hover:text-primary transition-colors"
            }`}
          >
            neurology
          </span>
          <span className="text-xs font-medium">Tech Pipeline</span>
        </Link>

        <Link
          href="/design-system"
          className={`flex items-center gap-3 px-3 py-2 rounded transition-all group ${
            pathname === "/design-system"
              ? "bg-white/5 text-primary font-bold"
              : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              pathname === "/design-system" ? "text-primary" : "group-hover:text-primary transition-colors"
            }`}
          >
            palette
          </span>
          <span className="text-xs font-medium">Design System</span>
        </Link>
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-outline-variant">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded text-on-surface-variant hover:bg-white/5 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-xs font-medium">Settings</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded text-on-surface-variant hover:bg-white/5 hover:text-red-400 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-xs font-medium">Terminate</span>
        </Link>
      </div>
    </aside>
  );
}
