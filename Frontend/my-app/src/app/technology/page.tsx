"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

interface StepNodeProps {
  num: string;
}

function StepNode({ num }: StepNodeProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-8 h-8 bg-black flex items-center justify-center rounded-full z-10 transition-colors select-none font-mono text-xs border"
      style={{
        borderColor: hovered ? "#ffffff" : "#333333",
        color: hovered ? "#ffffff" : "#888888",
      }}
    >
      {num}
    </div>
  );
}

export default function TechnologyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Header />
      <div className="flex flex-1 pt-14">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 py-8 max-w-[1200px] mx-auto w-full pb-20 md:pb-12">
          
          {/* Hero Section */}
          <section className="mb-16 max-w-2xl">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-4 border-l border-white pl-4 select-none">
              Engineering / Core Pipeline
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              The Neural Engine
            </h1>
            <p className="text-base text-zinc-400 leading-relaxed font-light">
              A low-latency, distributed translation pipeline designed for real-time cognitive interpretation. Built on a foundation of proprietary ASR, NMT, and TTS technologies.
            </p>
          </section>

          {/* Pipeline Steps Timeline */}
          <section className="relative mb-24 border-t border-[#333333] pt-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 relative">
              
              {/* Vertical Connector Line (Desktop) */}
              <div className="md:col-span-1 hidden md:flex flex-col items-center absolute left-[15px] top-0 bottom-0 select-none">
                <div className="w-[1px] bg-[#333333] h-full"></div>
              </div>

              {/* Content Column */}
              <div className="md:col-span-11 md:pl-10 space-y-16">
                
                {/* Step 1 */}
                <div className="relative pl-8 md:pl-0 grid md:grid-cols-2 gap-8 items-start">
                  {/* Step bubble */}
                  <div className="absolute left-[-16px] md:left-[-56px] top-0">
                    <StepNode num="01" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white mb-3">Audio Acquisition</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      High-fidelity 48kHz audio capture utilizing adaptive noise floors and beamforming to isolate speaker voice in complex environments.
                    </p>
                    <div className="flex items-center gap-3 py-2 border-y border-zinc-800">
                      <span className="material-symbols-outlined text-zinc-500 text-lg">mic</span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        Sampling: 48kHz / Linear PCM
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/30 p-6 border border-zinc-800 rounded-lg">
                    <div className="flex justify-between items-center mb-4 select-none">
                      <span className="font-mono text-[10px] text-zinc-500">WAVEFORM_MONITOR</span>
                      <div className="flex gap-1 h-5 items-end">
                        <div className="w-1 h-3 bg-white/20"></div>
                        <div className="w-1 h-5 bg-white"></div>
                        <div className="w-1 h-4 bg-white/50"></div>
                      </div>
                    </div>
                    <div className="h-16 w-full flex items-center justify-center border-t border-zinc-800 select-none">
                      <span className="font-mono text-[10px] text-zinc-400 animate-pulse">
                        STATUS: ACTIVE_LISTENING
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8 md:pl-0 grid md:grid-cols-2 gap-8 items-start">
                  <div className="absolute left-[-16px] md:left-[-56px] top-0">
                    <StepNode num="02" />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-3">Speech Recognition</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      Conversion of acoustic signals into text tokens using an optimized <span className="font-mono text-white text-xs bg-zinc-800 px-1 py-0.5 rounded">Whisper-v3</span> model, achieving sub-1% WER in studio conditions.
                    </p>
                    <div className="flex items-center gap-3 py-2 border-y border-zinc-800">
                      <span className="material-symbols-outlined text-zinc-500 text-lg">keyboard</span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        Model: Whisper-v3-Turbo
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/30 p-6 border border-zinc-800 rounded-lg flex flex-col justify-center select-none">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-zinc-500">Acoustic Logic</span>
                          <span className="text-white">PROCESSED</span>
                        </div>
                        <div className="h-1 bg-zinc-800 w-full overflow-hidden">
                          <div className="h-full bg-white w-4/5"></div>
                        </div>
                      </div>
                      <div className="flex justify-between font-mono text-[10px] border-t border-zinc-800/50 pt-2">
                        <span className="text-zinc-500">Token Extraction</span>
                        <span className="text-white">98.2% CONFIDENCE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 md:pl-0 grid md:grid-cols-2 gap-8 items-start">
                  <div className="absolute left-[-16px] md:left-[-56px] top-0">
                    <StepNode num="03" />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-3">Cognitive Translation</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      Multi-agentic translation engine leveraging <span className="font-mono text-white text-xs bg-zinc-800 px-1 py-0.5 rounded">NLLB-200</span> for context-aware, idiom-safe mapping between 200+ language pairs.
                    </p>
                    <div className="flex items-center gap-3 py-2 border-y border-zinc-800">
                      <span className="material-symbols-outlined text-zinc-500 text-lg">translate</span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        Context: Deep Neural Map
                      </span>
                    </div>
                  </div>

                  <div className="font-mono text-xs space-y-3">
                    <div className="p-3 border border-dashed border-zinc-700 bg-white/5">
                      <span className="text-zinc-500 mr-2">SOURCE [ES]:</span>
                      <span className="text-zinc-300">"¿Cómo va el proyecto de la infraestructura?"</span>
                    </div>
                    <div className="flex justify-center select-none">
                      <span className="material-symbols-outlined text-zinc-600 text-xs">expand_more</span>
                    </div>
                    <div className="p-3 border border-white bg-white text-black font-semibold">
                      <span className="text-black/50 mr-2">TARGET [EN]:</span>
                      <span>"How is the infrastructure project coming along?"</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 md:pl-0 grid md:grid-cols-2 gap-8 items-start">
                  <div className="absolute left-[-16px] md:left-[-56px] top-0">
                    <StepNode num="04" />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-3">Speech Synthesis</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      Reconstruction of emotional inflection and prosody through neural vocoding, resulting in low-latency, natural sounding output.
                    </p>
                    <div className="flex items-center gap-3 py-2 border-y border-zinc-800">
                      <span className="material-symbols-outlined text-zinc-500 text-lg">speaker_group</span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        Protocol: WebRTC / OPUS
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-zinc-800 p-4 flex flex-col items-center bg-zinc-900/10">
                      <span className="font-mono text-[9px] text-zinc-500 mb-2">LATENCY_CORE</span>
                      <span className="text-2xl font-bold tracking-tighter text-white">142ms</span>
                    </div>
                    <div className="border border-zinc-800 p-4 flex flex-col items-center bg-zinc-900/10">
                      <span className="font-mono text-[9px] text-zinc-500 mb-2">BITRATE_AVG</span>
                      <span className="text-2xl font-bold tracking-tighter text-white">128kbps</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Technical Specs Grid */}
          <section className="border-t border-[#333333] pt-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-8 select-none">
              Technical Infrastructure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#333333] border border-[#333333]">
              <div className="bg-black p-8 flex flex-col items-start gap-4">
                <span className="material-symbols-outlined text-[#2f54eb] text-3xl">security</span>
                <h4 className="text-lg font-medium text-white">End-to-End Encryption</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  Data is encrypted at the source and decrypted at the destination. No intermediate plaintext storage.
                </p>
              </div>
              <div className="bg-black p-8 flex flex-col items-start gap-4">
                <span className="material-symbols-outlined text-[#2f54eb] text-3xl">public</span>
                <h4 className="text-lg font-medium text-white">Global Edge Mesh</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  Compute nodes distributed across 32 global regions ensure round-trip latency stays under 50ms.
                </p>
              </div>
              <div className="bg-black p-8 flex flex-col items-start gap-4">
                <span className="material-symbols-outlined text-[#2f54eb] text-3xl">api</span>
                <h4 className="text-lg font-medium text-white">Enterprise API</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  REST and WebSocket endpoints for seamless integration into existing call center or meeting software.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-12 border-t border-zinc-800 mt-20 bg-black">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="font-bold text-xl text-white mb-2">LiveLingua</div>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              © 2026 System Version 4.2.0-Alpha
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Link className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors" href="#">
              Privacy
            </Link>
            <Link className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors" href="#">
              Security
            </Link>
            <Link className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors" href="#">
              Documentation
            </Link>
            <Link className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors" href="#">
              Status
            </Link>
          </div>
        </div>
      </footer>

      {/* Mobile navigation bottom bar */}
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
        <Link href="/technology" className="flex flex-col items-center gap-0.5 text-primary">
          <span className="material-symbols-outlined text-[20px]">neurology</span>
          <span className="text-[10px] font-medium">Tech</span>
        </Link>
        <Link href="/design-system" className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white">
          <span className="material-symbols-outlined text-[20px]">palette</span>
          <span className="text-[10px] font-medium">Design</span>
        </Link>
      </div>
    </div>
  );
}
