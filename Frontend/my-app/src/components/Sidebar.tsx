"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // If we are on the landing page, we don't display a sidebar
  if (pathname === "/") return null;

  return (
    <aside className="hidden md:flex flex-col h-full w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl shrink-0 z-50">
      {/* Branding Block: click to navigate back to dashboard */}
      <Link 
        href="/" 
        className="p-stack-lg h-20 flex items-center gap-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 select-none overflow-hidden group-hover:border-primary/45 transition-colors">
          <img 
            src="https://lh3.googleusercontent.com/aida/AP1WRLuKVSk3_84_5GQ6VkK2082k2yi4ZiupJd9HG6EFX_8ZdPjwMZ0pLB9YafMoTihOJwySlqPC8GR_ysGt6qanmSuH3t0OgpcAsHo_JkfRvhqb2XSZOGNqnsNNnHc4yj2BKgPqtrsSHLUsfnNcL6VIJQFqaFU51fidPBqq50VrfNldOBJEFxfdb-9Byi7HcQqBxZpgL9YnhDIkarAFkZnrdwPiDUPTpeQziyaJdyrhHuLsyC_MvFuOTOSzWw" 
            alt="Voxa Logo" 
            className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md font-bold text-on-background tracking-tight group-hover:text-white transition-colors">Voxa</span>
          <span className="text-[9px] text-[#ffb869] font-mono tracking-widest uppercase leading-none mt-0.5">VOXA AI ACTIVE</span>
        </div>
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 mt-stack-md">
        <ul className="space-y-1">
          <li>
            <Link
              href="/workspace"
              className={`flex items-center px-stack-lg py-4 font-label-md text-label-md transition-all group ${
                pathname === "/workspace"
                  ? "sidebar-item-active font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              }`}
            >
              <span
                className="material-symbols-outlined mr-4 text-[22px]"
                style={pathname === "/workspace" ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                dashboard
              </span>
              Workspace
            </Link>
          </li>

          <li>
            <Link
              href="/technology"
              className={`flex items-center px-stack-lg py-4 font-label-md text-label-md transition-all group ${
                pathname === "/technology"
                  ? "sidebar-item-active font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              }`}
            >
              <span
                className="material-symbols-outlined mr-4 text-[22px]"
                style={pathname === "/technology" ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                insights
              </span>
              Tech Pipeline
            </Link>
          </li>

          <li>
            <Link
              href="/design-system"
              className={`flex items-center px-stack-lg py-4 font-label-md text-label-md transition-all group ${
                pathname === "/design-system"
                  ? "sidebar-item-active font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              }`}
            >
              <span
                className="material-symbols-outlined mr-4 text-[22px]"
                style={pathname === "/design-system" ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                palette
              </span>
              Design System
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer Navigation */}
      <div className="p-stack-lg border-t border-white/5 flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Link
            href="#"
            className="flex items-center text-on-surface-variant hover:text-on-surface transition-all font-label-md text-label-md"
          >
            <span className="material-symbols-outlined mr-4 text-[22px]">settings</span>
            Preferences
          </Link>
          <Link
            href="/"
            className="flex items-center text-on-surface-variant hover:text-red-400 transition-all font-label-md text-label-md"
          >
            <span className="material-symbols-outlined mr-4 text-[22px]">logout</span>
            Terminate Session
          </Link>
        </div>

        {/* Customized Profile Card for Priyanshu Raj */}
        <div className="flex flex-col gap-3 p-3.5 bg-white/3 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#adc6ff] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#8b5cf6]/20 select-none">
              PR
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-on-background leading-tight">Priyanshu Raj</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase leading-none mt-0.5">Lead Architect</span>
            </div>
          </div>

          {/* Social Platforms Links */}
          <div className="flex items-center gap-3.5 px-1 pt-1.5 text-zinc-400 border-t border-white/5">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#0077b5] transition-all hover:scale-110 active:scale-95 duration-200"
              title="LinkedIn Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a 
              href="https://github.com/priyanshuraj20" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-all hover:scale-110 active:scale-95 duration-200"
              title="GitHub Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#e1306c] transition-all hover:scale-110 active:scale-95 duration-200"
              title="Instagram Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a 
              href="mailto:priyanshuraj.work@gmail.com" 
              className="hover:text-[#8b5cf6] transition-all hover:scale-110 active:scale-95 duration-200"
              title="Send Email"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>
        </div>

        {/* Customized Developer Signature */}
        <div className="flex flex-col items-center justify-center gap-1 py-1 select-none border-t border-white/[0.03] pt-4 text-center">
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider leading-relaxed">
            Fueled by <span className="text-[#ffb869] font-semibold">Diet Coke</span> 🥤 &amp; <span className="text-[#8b5cf6] font-semibold">iterating minds</span> 🧠
          </p>
          <p className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase mt-0.5">
            — Priyanshu Raj
          </p>
        </div>
      </div>
    </aside>
  );
}
