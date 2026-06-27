"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Header />
      <div className="flex flex-1 pt-14">
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 px-6 md:px-12 py-8 max-w-[1200px] mx-auto w-full pb-20 md:pb-12">
          
          {/* Header */}
          <section className="mb-12 border-b border-zinc-800 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Precision Dark Design System
            </h1>
            <p className="text-sm text-zinc-400 font-light max-w-2xl leading-relaxed">
              A high-contrast, developer-centric design system utilizing Geist typography, micro-precision hairline borders, and strict spatial alignments.
            </p>
          </section>

          {/* Typography Scale */}
          <section className="mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 select-none">
              01 / Typography Scale
            </h2>
            <div className="space-y-8 bg-zinc-950 p-6 border border-zinc-900 rounded-lg">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
                <span className="font-mono text-xs text-zinc-500 min-w-32">Display</span>
                <span className="text-[48px] font-semibold tracking-tighter leading-none text-white">
                  Neural Translation
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
                <span className="font-mono text-xs text-zinc-500 min-w-32">Headline Large</span>
                <span className="text-[32px] font-semibold tracking-tight text-white">
                  The Neural Engine v3
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
                <span className="font-mono text-xs text-zinc-500 min-w-32">Headline Medium</span>
                <span className="text-[20px] font-medium tracking-tight text-white">
                  Tokyo Node Session Inspector
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
                <span className="font-mono text-xs text-zinc-500 min-w-32">Body Large</span>
                <span className="text-base text-zinc-300 font-normal leading-relaxed">
                  High-fidelity 48kHz audio capture utilizing adaptive noise floors and beamforming to isolate speaker voice.
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
                <span className="font-mono text-xs text-zinc-500 min-w-32">Body Small</span>
                <span className="text-sm text-zinc-400 font-normal leading-normal">
                  Conversion of acoustic signals into text tokens using an optimized Whisper-v3 model.
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
                <span className="font-mono text-xs text-zinc-500 min-w-32">Label Medium</span>
                <span className="text-xs font-medium tracking-widest text-primary uppercase">
                  RECORDING_STATE: ACTIVE
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="font-mono text-xs text-zinc-500 min-w-32">Mono</span>
                <span className="font-mono text-xs text-zinc-300">
                  const pipeline = new NeuralPipeline("ES-LATAM", "EN-US");
                </span>
              </div>

            </div>
          </section>

          {/* Color swatches */}
          <section className="mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 select-none">
              02 / Color Palette
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              
              <div className="border border-zinc-900 bg-black p-4 flex flex-col justify-between h-28">
                <div className="w-full h-8 bg-black border border-white/10 rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white">Background</p>
                  <p className="font-mono text-[10px] text-zinc-500">#000000</p>
                </div>
              </div>

              <div className="border border-zinc-900 bg-zinc-950 p-4 flex flex-col justify-between h-28">
                <div className="w-full h-8 bg-[#0a0a0a] border border-white/10 rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white">Surface</p>
                  <p className="font-mono text-[10px] text-zinc-500">#0a0a0a</p>
                </div>
              </div>

              <div className="border border-zinc-900 bg-zinc-950 p-4 flex flex-col justify-between h-28">
                <div className="w-full h-8 bg-[#2f54eb] rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white">Accent Blue</p>
                  <p className="font-mono text-[10px] text-zinc-500">#2f54eb</p>
                </div>
              </div>

              <div className="border border-zinc-900 bg-zinc-950 p-4 flex flex-col justify-between h-28">
                <div className="w-full h-8 bg-[#b9c3ff] rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white">Primary Indigo</p>
                  <p className="font-mono text-[10px] text-zinc-500">#b9c3ff</p>
                </div>
              </div>

              <div className="border border-zinc-900 bg-zinc-950 p-4 flex flex-col justify-between h-28">
                <div className="w-full h-8 bg-[#ffb59a] rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white">Tertiary Peach</p>
                  <p className="font-mono text-[10px] text-zinc-500">#ffb59a</p>
                </div>
              </div>

              <div className="border border-zinc-900 bg-zinc-950 p-4 flex flex-col justify-between h-28">
                <div className="w-full h-8 bg-[#93000a] rounded"></div>
                <div>
                  <p className="text-xs font-bold text-white">Error Red</p>
                  <p className="font-mono text-[10px] text-zinc-500">#93000a</p>
                </div>
              </div>

            </div>
          </section>

          {/* Core Interactive Elements */}
          <section className="grid md:grid-cols-2 gap-12 mb-16">
            
            {/* Buttons */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 select-none">
                03 / Buttons
              </h2>
              <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-lg flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary Blue</Button>
                <Button variant="secondary">Secondary Dark</Button>
                <Button variant="outline">Outline Hairline</Button>
                <Button variant="white">White Action</Button>
                <Button variant="ghost">Ghost Label</Button>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 select-none">
                04 / Input Fields
              </h2>
              <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-lg space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                    Session Name Input
                  </label>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className={`w-full bg-black px-4 py-2 border rounded-md font-sans text-sm focus:outline-none transition-all ${
                      inputFocused ? "border-[#2f54eb] ring-1 ring-[#2f54eb]/10" : "border-white/10"
                    }`}
                    placeholder="Enter strategic review details..."
                    type="text"
                  />
                </div>
              </div>
            </div>

          </section>

          {/* Cells and Chips */}
          <section className="grid md:grid-cols-2 gap-12 mb-16">
            
            {/* Cells/Cards */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 select-none">
                05 / Cards & Cells
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border border-white/10 bg-transparent rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-3">memory</span>
                  <h4 className="text-sm font-semibold text-white mb-1">Cell Transparent</h4>
                  <p className="text-xs text-zinc-500">1px border with zero shadow.</p>
                </div>
                <div className="p-6 border border-white/10 bg-zinc-950 rounded-lg">
                  <span className="material-symbols-outlined text-[#ffb59a] mb-3">cloud</span>
                  <h4 className="text-sm font-semibold text-white mb-1">Cell Fill Solid</h4>
                  <p className="text-xs text-zinc-500">Dark fill background border.</p>
                </div>
              </div>
            </div>

            {/* Chips & Tags */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 select-none">
                06 / Chips & Tags
              </h2>
              <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-lg flex flex-wrap gap-3 items-center">
                <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-400 uppercase font-mono tracking-widest">
                  ES-LATAM
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary uppercase font-mono tracking-widest">
                  Active
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded border border-tertiary/20 bg-tertiary/5 text-tertiary uppercase font-mono tracking-widest">
                  Target_JPN
                </span>
              </div>
            </div>

          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-black border-t border-zinc-900 flex justify-between items-center relative z-10">
        <span className="text-sm font-bold text-white">LiveLingua</span>
        <span className="font-mono text-[10px] text-zinc-500">DESIGN_SYSTEM_SPEC_4.0</span>
      </footer>

      {/* Mobile nav bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#111111] border-t border-white/10 flex justify-around items-center h-14 z-50">
        <Link href="/workspace" className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white">
          <span className="material-symbols-outlined text-[20px]">mic</span>
          <span className="text-[10px] font-medium">Workspace</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            history
          </span>
          <span className="text-[10px] font-medium">History</span>
        </Link>
        <Link href="/technology" className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white">
          <span className="material-symbols-outlined text-[20px]">neurology</span>
          <span className="text-[10px] font-medium">Tech</span>
        </Link>
        <Link href="/design-system" className="flex flex-col items-center gap-0.5 text-primary">
          <span className="material-symbols-outlined text-[20px]">palette</span>
          <span className="text-[10px] font-medium">Design</span>
        </Link>
      </div>
    </div>
  );
}
