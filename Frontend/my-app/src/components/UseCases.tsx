"use client";

import React from "react";
import Link from "next/link";

/**
 * USE CASES COMPONENT
 * 
 * WHY THIS WAS MODULARIZED:
 * Isolating product use-case grids ensures that updates to marketing materials, platform listings, 
 * or landing CTA structures can be tested and updated without modifying the core landing layout code.
 */
export default function UseCases() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-24 border-t border-white/5 relative z-10">
      <div className="mb-16 text-center">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/50 border-l-2 border-[#8b5cf6] pl-4">Use Cases & Integration</span>
        <h2 className="text-3xl md:text-4xl font-semibold font-geist text-white mt-3 tracking-tight">Translate anywhere in your browser.</h2>
        <p className="text-sm text-[#cbc3d7]/70 mt-3 max-w-xl mx-auto font-light leading-relaxed">
          Voxa intercepts audio at the browser level, making it compatible with any virtual communication web application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Google Meet */}
        <div className="premium-card p-6 border border-white/5 flex flex-col justify-between group hover:border-[#8b5cf6]/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-xl text-emerald-400">videocam</span>
            </div>
            <h3 className="font-semibold text-base mb-2 text-white font-geist">Google Meet</h3>
            <p className="text-[#cbc3d7]/70 text-xs leading-relaxed">
              Real-time translation of remote participants during business calls. Generates clean subtitles and speaks translation output instantly.
            </p>
          </div>
          <div className="mt-6 text-[10px] text-zinc-500 font-mono">SUPPORTED ➔ ACTIVE</div>
        </div>

        {/* Card 2: Zoom Video */}
        <div className="premium-card p-6 border border-white/5 flex flex-col justify-between group hover:border-[#adc6ff]/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-xl text-[#3b82f6]">co_present</span>
            </div>
            <h3 className="font-semibold text-base mb-2 text-white font-geist">Zoom Web</h3>
            <p className="text-[#cbc3d7]/70 text-xs leading-relaxed">
              Translates Zoom calls directly on the web app. Captures speaker voice directly from the browser tab without any local downloads.
            </p>
          </div>
          <div className="mt-6 text-[10px] text-zinc-500 font-mono">SUPPORTED ➔ ACTIVE</div>
        </div>

        {/* Card 3: WhatsApp Web */}
        <div className="premium-card p-6 border border-white/5 flex flex-col justify-between group hover:border-[#ffb869]/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-xl text-green-400">call</span>
            </div>
            <h3 className="font-semibold text-base mb-2 text-white font-geist">WhatsApp Web</h3>
            <p className="text-[#cbc3d7]/70 text-xs leading-relaxed">
              Translates incoming audio and video calls. Converts and plays back spoken translations on the fly during personal conversation calls.
            </p>
          </div>
          <div className="mt-6 text-[10px] text-zinc-500 font-mono">SUPPORTED ➔ ACTIVE</div>
        </div>

        {/* Card 4: Media Streaming */}
        <div className="premium-card p-6 border border-white/5 flex flex-col justify-between group hover:border-[#d0bcff]/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-xl text-red-400">play_circle</span>
            </div>
            <h3 className="font-semibold text-base mb-2 text-white font-geist">YouTube & Live Streams</h3>
            <p className="text-[#cbc3d7]/70 text-xs leading-relaxed">
              Practise translation by listening to global news, video podcasts, and streamers. Translate voice output live directly into your language.
            </p>
          </div>
          <div className="mt-6 text-[10px] text-zinc-500 font-mono">SUPPORTED ➔ ACTIVE</div>
        </div>

      </div>

      {/* Centric Try It Out Call To Action */}
      <div className="mt-16 bg-white/3 border border-white/5 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <h3 className="text-xl font-bold text-white font-geist mb-2">Ready to try out Voxa's translation workspace?</h3>
          <p className="text-xs text-[#cbc3d7]/70 leading-relaxed font-light">
            Launch the workspace sandbox immediately to test the translation engine. Configure your target locales, adjust speech synthesis, and try the real-time pipeline.
          </p>
        </div>
        <Link 
          href="/workspace"
          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 px-6 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#8b5cf6]/20 transition-all select-none whitespace-nowrap active:scale-98"
        >
          Launch Translation Workspace
          <span className="material-symbols-outlined text-sm">rocket_launch</span>
        </Link>
      </div>
    </section>
  );
}
