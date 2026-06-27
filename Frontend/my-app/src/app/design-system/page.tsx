"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ShaderBackground from "@/components/ui/ShaderBackground";

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-black text-[#e7e0ed] relative font-sans">
      {/* Interactive WebGL Shader backdrop */}
      <ShaderBackground />

      <Header />
      
      {/* Sidebar + Main area layout */}
      <div className="flex flex-1 pt-[120px] relative z-10">
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 px-6 md:px-12 py-8 max-w-[1200px] mx-auto w-full pb-20 md:pb-12 bg-transparent overflow-y-auto">
          
          {/* Header */}
          <section className="mb-12 border-b border-white/5 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-white font-geist mb-2">
              Obsidian Flux Design System
            </h1>
            <p className="text-sm text-[#cbc3d7]/70 font-light max-w-2xl leading-relaxed font-sans">
              A premium, high-contrast, developer-centric design system utilizing Geist typography, micro-precision hairline borders (#1f1f1f), and strict spatial rhythm.
            </p>
          </section>

          {/* Spacing & Layout Tokens */}
          <section className="mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#cbc3d7]/50 mb-6 select-none">
              01 / Grid & Rhythm Spec
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 border border-white/5 bg-[#0a0a0a]/90 rounded-lg">
                <span className="font-mono text-[9px] text-[#cbc3d7]/40 block uppercase tracking-wider mb-2">Base Unit</span>
                <span className="text-lg font-bold text-white font-geist">4px</span>
              </div>
              <div className="p-4 border border-white/5 bg-[#0a0a0a]/90 rounded-lg">
                <span className="font-mono text-[9px] text-[#cbc3d7]/40 block uppercase tracking-wider mb-2">Standard Radius</span>
                <span className="text-lg font-bold text-white font-geist">4px (0.25rem)</span>
              </div>
              <div className="p-4 border border-white/5 bg-[#0a0a0a]/90 rounded-lg">
                <span className="font-mono text-[9px] text-[#cbc3d7]/40 block uppercase tracking-wider mb-2">Large Radius</span>
                <span className="text-lg font-bold text-white font-geist">8px (0.5rem)</span>
              </div>
              <div className="p-4 border border-white/5 bg-[#0a0a0a]/90 rounded-lg">
                <span className="font-mono text-[9px] text-[#cbc3d7]/40 block uppercase tracking-wider mb-2">Safe Margins</span>
                <span className="text-lg font-bold text-white font-geist">32px / 20px</span>
              </div>
            </div>
          </section>

          {/* Typography Scale */}
          <section className="mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#cbc3d7]/50 mb-6 select-none">
              02 / Typography Scale
            </h2>
            <div className="space-y-8 bg-[#0a0a0a]/90 p-6 border border-white/5 rounded-xl">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <span className="font-mono text-xs text-[#cbc3d7]/50 min-w-32 uppercase tracking-wider">Display Large</span>
                <span className="text-4xl md:text-5xl font-bold tracking-tighter leading-none text-white font-geist">
                  Neural Translation
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <span className="font-mono text-xs text-[#cbc3d7]/50 min-w-32 uppercase tracking-wider">Headline Large</span>
                <span className="text-2xl md:text-3xl font-semibold tracking-tight text-white font-geist">
                  The Neural Engine v3.0
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <span className="font-mono text-xs text-[#cbc3d7]/50 min-w-32 uppercase tracking-wider">Headline Medium</span>
                <span className="text-lg md:text-xl font-medium tracking-tight text-white font-geist">
                  Tokyo Session Inspector Node
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <span className="font-mono text-xs text-[#cbc3d7]/50 min-w-32 uppercase tracking-wider">Body Large</span>
                <span className="text-base text-[#cbc3d7] font-normal leading-relaxed font-sans font-light">
                  High-fidelity 48kHz audio capture utilizing adaptive noise floors and beamforming to isolate speaker voice.
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <span className="font-mono text-xs text-[#cbc3d7]/50 min-w-32 uppercase tracking-wider">Body Small</span>
                <span className="text-sm text-[#cbc3d7]/70 font-normal leading-normal font-sans font-light">
                  Conversion of acoustic signals into text tokens using an optimized Whisper-v3 model.
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <span className="font-mono text-xs text-[#cbc3d7]/50 min-w-32 uppercase tracking-wider">Label Medium</span>
                <span className="text-xs font-semibold tracking-widest text-[#d0bcff] uppercase font-geist">
                  RECORDING_STATE: ACTIVE
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#cbc3d7]/50 min-w-32 uppercase tracking-wider">Mono Medium</span>
                <span className="font-mono text-xs text-[#adc6ff]">
                  const translation = await voxa.translate(audioBlob, "en-US", "hi-IN");
                </span>
              </div>

            </div>
          </section>

          {/* Color swatches */}
          <section className="mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#cbc3d7]/50 mb-6 select-none">
              03 / Color Palette (Obsidian Flux)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 select-none">
              
              <div className="border border-white/5 bg-black p-4 flex flex-col justify-between h-28 rounded-lg">
                <div className="w-full h-8 bg-black border border-white/10 rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white font-geist">Base</p>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">#000000</p>
                </div>
              </div>

              <div className="border border-white/5 bg-[#0a0a0a] p-4 flex flex-col justify-between h-28 rounded-lg">
                <div className="w-full h-8 bg-[#0a0a0a] border border-white/10 rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white font-geist">Surface L1</p>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">#0a0a0a</p>
                </div>
              </div>

              <div className="border border-white/5 bg-[#15121b] p-4 flex flex-col justify-between h-28 rounded-lg">
                <div className="w-full h-8 bg-[#15121b] border border-white/10 rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white font-geist">Surface L2</p>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">#15121b</p>
                </div>
              </div>

              <div className="border border-white/5 bg-[#0a0a0a] p-4 flex flex-col justify-between h-28 rounded-lg">
                <div className="w-full h-8 bg-[#8b5cf6] rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white font-geist">Primary</p>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">#8B5CF6</p>
                </div>
              </div>

              <div className="border border-white/5 bg-[#0a0a0a] p-4 flex flex-col justify-between h-28 rounded-lg">
                <div className="w-full h-8 bg-[#3b82f6] rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white font-geist">Secondary</p>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">#3B82F6</p>
                </div>
              </div>

              <div className="border border-white/5 bg-[#0a0a0a] p-4 flex flex-col justify-between h-28 rounded-lg">
                <div className="w-full h-8 bg-[#ffb869] rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white font-geist">Tertiary</p>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">#ffb869</p>
                </div>
              </div>

            </div>
          </section>

          {/* Interactive Elements Showcase */}
          <section className="grid md:grid-cols-2 gap-12 mb-16">
            
            {/* Buttons */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#cbc3d7]/50 mb-6 select-none">
                04 / Interactive Buttons
              </h2>
              <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-6 border border-white/5 rounded-xl flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary Purple</Button>
                <Button variant="secondary">Secondary Dark</Button>
                <Button variant="outline">Outline Hairline</Button>
                <Button variant="white">White Action</Button>
                <Button variant="ghost">Ghost Link</Button>
              </div>
            </div>

            {/* Input Controls */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#cbc3d7]/50 mb-6 select-none">
                05 / Inputs & Focus state
              </h2>
              <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-6 border border-white/5 rounded-xl space-y-4 font-sans">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block select-none">
                    Translation Topic name
                  </label>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className={`w-full bg-black px-4 py-2.5 border rounded-lg font-sans text-sm focus:outline-none transition-all ${
                      inputFocused ? "border-[#8b5cf6] ring-1 ring-[#8b5cf6]/20" : "border-white/5"
                    }`}
                    placeholder="Enter description name..."
                    type="text"
                  />
                </div>
              </div>
            </div>

          </section>

          {/* Cards & Chips Showcase */}
          <section className="grid md:grid-cols-2 gap-12 mb-16">
            
            {/* Cells/Cards */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#cbc3d7]/50 mb-6 select-none">
                06 / Dashboard Cards
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border border-white/5 bg-[#0a0a0a]/90 rounded-xl group hover:border-[#8b5cf6]/30 transition-colors">
                  <span className="material-symbols-outlined text-[#8b5cf6] mb-3">memory</span>
                  <h4 className="text-sm font-semibold text-white font-geist mb-1">Standard Card</h4>
                  <p className="text-xs text-[#cbc3d7]/60 font-light">Hairline outline border card with hover gradient glow.</p>
                </div>
                <div className="p-6 border border-white/5 bg-[#15121b]/90 rounded-xl group hover:border-[#adc6ff]/30 transition-colors">
                  <span className="material-symbols-outlined text-[#adc6ff] mb-3">cloud</span>
                  <h4 className="text-sm font-semibold text-white font-geist mb-1">Secondary Card</h4>
                  <p className="text-xs text-[#cbc3d7]/60 font-light font-sans">Dark violet/charcoal surface fill container card.</p>
                </div>
              </div>
            </div>

            {/* Chips & Tags */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#cbc3d7]/50 mb-6 select-none">
                07 / Locales & Tag Chips
              </h2>
              <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-6 border border-white/5 rounded-xl flex flex-wrap gap-3 items-center select-none">
                <span className="text-[9px] px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-[#cbc3d7] uppercase font-mono tracking-wider font-bold">
                  Locale: EN-US
                </span>
                <span className="text-[9px] px-2.5 py-1 rounded-lg border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 text-[#d0bcff] uppercase font-mono tracking-wider font-bold">
                  Status: Active
                </span>
                <span className="text-[9px] px-2.5 py-1 rounded-lg border border-[#ffb869]/20 bg-[#ffb869]/5 text-[#ffb869] uppercase font-mono tracking-wider font-bold">
                  NLLB-ENG-TO-HIN
                </span>
              </div>
            </div>

          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-black border-t border-white/5 flex justify-between items-center relative z-10 select-none">
        <span className="text-sm font-bold text-white font-headline-md">Voxa</span>
        <span className="font-mono text-[9px] text-[#cbc3d7]/40 uppercase tracking-widest">DESIGN_SYSTEM_SPEC_4.0</span>
      </footer>

      {/* Mobile nav bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-16 z-50">
        <Link href="/workspace" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-medium font-sans">Workspace</span>
        </Link>
        <Link href="/technology" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">insights</span>
          <span className="text-[10px] font-medium font-sans">Pipeline</span>
        </Link>
        <Link href="/design-system" className="flex flex-col items-center gap-1 text-[#8b5cf6] flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">palette</span>
          <span className="text-[10px] font-medium font-sans">Specs</span>
        </Link>
      </div>
    </div>
  );
}
