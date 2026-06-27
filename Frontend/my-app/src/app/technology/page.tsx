"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import ShaderBackground from "@/components/ui/ShaderBackground";

interface StepNodeProps {
  num: string;
}

function StepNode({ num }: StepNodeProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-10 h-10 bg-black flex items-center justify-center rounded-full z-10 transition-colors select-none font-mono text-sm border"
      style={{
        borderColor: hovered ? "#8b5cf6" : "rgba(255, 255, 255, 0.1)",
        color: hovered ? "#d0bcff" : "#cbc3d7",
      }}
    >
      {num}
    </div>
  );
}

export default function TechnologyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-[#e7e0ed] relative font-sans">
      {/* WebGL interactive background */}
      <ShaderBackground />

      <Header />
      
      {/* Sidebar + Core Main area */}
      <div className="flex flex-1 pt-[120px] relative z-10">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 py-8 max-w-[1200px] mx-auto w-full pb-20 md:pb-12 bg-transparent overflow-y-auto">
          
          {/* Hero Section */}
          <section className="mb-16 max-w-2xl">
            <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/50 mb-4 border-l-2 border-[#8b5cf6] pl-4 select-none">
              Engineering / Core Translation Pipeline
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white font-geist mb-6">
              The Neural Engine
            </h1>
            <p className="text-base text-[#cbc3d7]/70 leading-relaxed font-light font-sans">
              A low-latency, distributed translation pipeline designed for real-time cognitive interpretation. Built on a foundation of proprietary ASR (Whisper), NMT (NLLB), and synthetic speech vocoders.
            </p>
          </section>

          {/* Pipeline Steps Timeline */}
          <section className="relative mb-24 border-t border-white/5 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 relative">
              
              {/* Vertical Connector Line (Desktop) */}
              <div className="md:col-span-1 hidden md:flex flex-col items-center absolute left-[19px] top-0 bottom-0 select-none">
                <div className="w-[1px] bg-white/5 h-full"></div>
              </div>

              {/* Content Column */}
              <div className="md:col-span-11 md:pl-10 space-y-16">
                
                {/* Step 1 */}
                <div className="relative pl-8 md:pl-0 grid md:grid-cols-2 gap-8 items-start">
                  {/* Step bubble */}
                  <div className="absolute left-[-20px] md:left-[-60px] top-0">
                    <StepNode num="01" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-white font-geist mb-3">Audio Acquisition</h3>
                    <p className="text-[#cbc3d7]/70 text-sm leading-relaxed mb-4 font-light">
                      High-fidelity 48kHz audio capture utilizing adaptive noise floors and voice activity detection (VAD) to isolate speaker voice in complex acoustic environments.
                    </p>
                    <div className="flex items-center gap-3 py-2 border-y border-white/5">
                      <span className="material-symbols-outlined text-[#8b5cf6] text-lg">mic</span>
                      <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                        Sampling: 48kHz / Linear PCM
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-6 border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-4 select-none">
                      <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-wider">WAVEFORM_MONITOR</span>
                      <div className="flex gap-1 h-5 items-end">
                        <div className="w-1 h-3 bg-[#8b5cf6]/20"></div>
                        <div className="w-1 h-5 bg-[#8b5cf6]"></div>
                        <div className="w-1 h-4 bg-[#adc6ff]"></div>
                      </div>
                    </div>
                    <div className="h-16 w-full flex items-center justify-center border-t border-white/5 select-none">
                      <span className="font-mono text-[10px] text-[#adc6ff] animate-pulse uppercase tracking-wider font-bold">
                        STATUS: ACTIVE_LISTENING
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8 md:pl-0 grid md:grid-cols-2 gap-8 items-start">
                  <div className="absolute left-[-20px] md:left-[-60px] top-0">
                    <StepNode num="02" />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white font-geist mb-3">Speech Recognition (ASR)</h3>
                    <p className="text-[#cbc3d7]/70 text-sm leading-relaxed mb-4 font-light">
                      Conversion of acoustic signals into text tokens using an optimized <span className="font-mono text-white text-xs bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-lg">Whisper-v3-Turbo</span> model, achieving minimal word error rates (WER).
                    </p>
                    <div className="flex items-center gap-3 py-2 border-y border-white/5">
                      <span className="material-symbols-outlined text-[#8b5cf6] text-lg">keyboard</span>
                      <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                        Model: Whisper-v3-Turbo
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-6 border border-white/5 rounded-xl flex flex-col justify-center select-none">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider">
                          <span className="text-zinc-500">Acoustic Logic</span>
                          <span className="text-[#d0bcff] font-bold">PROCESSED</span>
                        </div>
                        <div className="h-1 bg-white/10 w-full overflow-hidden rounded-full">
                          <div className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#adc6ff] w-4/5"></div>
                        </div>
                      </div>
                      <div className="flex justify-between font-mono text-[9px] border-t border-white/5 pt-3 uppercase tracking-wider">
                        <span className="text-zinc-500">Token Extraction</span>
                        <span className="text-white font-bold">98.2% CONFIDENCE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 md:pl-0 grid md:grid-cols-2 gap-8 items-start">
                  <div className="absolute left-[-20px] md:left-[-60px] top-0">
                    <StepNode num="03" />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white font-geist mb-3">Cognitive Translation (NMT)</h3>
                    <p className="text-[#cbc3d7]/70 text-sm leading-relaxed mb-4 font-light">
                      Contextual translation engine leveraging distilled <span className="font-mono text-white text-xs bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-lg">NLLB-200</span> transformers for context-aware, idiom-safe mapping between multiple language pairs.
                    </p>
                    <div className="flex items-center gap-3 py-2 border-y border-white/5">
                      <span className="material-symbols-outlined text-[#8b5cf6] text-lg">translate</span>
                      <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                        Context: Deep Neural Semantic Map
                      </span>
                    </div>
                  </div>

                  <div className="font-mono text-xs space-y-3">
                    <div className="p-3 border border-white/5 bg-[#0a0a0a]/90 rounded-lg">
                      <span className="text-zinc-500 mr-2 uppercase tracking-wider text-[9px]">SOURCE [ES]:</span>
                      <span className="text-zinc-300">"¿Cómo va el proyecto de la infraestructura?"</span>
                    </div>
                    <div className="flex justify-center select-none">
                      <span className="material-symbols-outlined text-zinc-600 text-xs">expand_more</span>
                    </div>
                    <div className="p-3 border border-[#8b5cf6]/35 bg-[#8b5cf6]/10 text-white rounded-lg">
                      <span className="text-[#d0bcff] mr-2 uppercase tracking-wider text-[9px] font-bold">TARGET [EN]:</span>
                      <span className="font-sans font-light">"How is the infrastructure project coming along?"</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 md:pl-0 grid md:grid-cols-2 gap-8 items-start">
                  <div className="absolute left-[-20px] md:left-[-60px] top-0">
                    <StepNode num="04" />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white font-geist mb-3">Speech Synthesis (TTS)</h3>
                    <p className="text-[#cbc3d7]/70 text-sm leading-relaxed mb-4 font-light">
                      Reconstruction of emotional inflection and prosody through deep neural vocoding, outputting low-latency synthetic speech streams.
                    </p>
                    <div className="flex items-center gap-3 py-2 border-y border-white/5">
                      <span className="material-symbols-outlined text-[#8b5cf6] text-lg">speaker_group</span>
                      <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                        Protocol: WebRTC / OPUS
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 select-none">
                    <div className="border border-white/5 p-4 flex flex-col items-center bg-[#0a0a0a]/90 rounded-xl">
                      <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest mb-2">LATENCY_CORE</span>
                      <span className="text-2xl font-bold tracking-tighter text-white font-geist">142ms</span>
                    </div>
                    <div className="border border-white/5 p-4 flex flex-col items-center bg-[#0a0a0a]/90 rounded-xl">
                      <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest mb-2">BITRATE_AVG</span>
                      <span className="text-2xl font-bold tracking-tighter text-white font-geist">128kbps</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Technical Specs Grid */}
          <section className="border-t border-white/5 pt-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#cbc3d7]/50 mb-8 select-none">
              Technical Infrastructure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
              <div className="bg-[#0a0a0a]/90 backdrop-blur-sm p-8 flex flex-col items-start gap-4">
                <span className="material-symbols-outlined text-[#8b5cf6] text-3xl">security</span>
                <h4 className="text-lg font-medium text-white font-geist">End-to-End Encryption</h4>
                <p className="text-sm text-[#cbc3d7]/70 leading-relaxed font-light">
                  Data is encrypted at source and decrypted at destination. No intermediate plaintext logging or storage.
                </p>
              </div>
              <div className="bg-[#0a0a0a]/90 backdrop-blur-sm p-8 flex flex-col items-start gap-4">
                <span className="material-symbols-outlined text-[#adc6ff] text-3xl">public</span>
                <h4 className="text-lg font-medium text-white font-geist">Global Edge Mesh</h4>
                <p className="text-sm text-[#cbc3d7]/70 leading-relaxed font-light">
                  Compute nodes distributed across 32 edge regions ensure round-trip latency stays under 50ms.
                </p>
              </div>
              <div className="bg-[#0a0a0a]/90 backdrop-blur-sm p-8 flex flex-col items-start gap-4">
                <span className="material-symbols-outlined text-[#ffb869] text-3xl">api</span>
                <h4 className="text-lg font-medium text-white font-geist">Enterprise API SDK</h4>
                <p className="text-sm text-[#cbc3d7]/70 leading-relaxed font-light">
                  REST, gRPC, and WebSocket streaming sockets for seamless integration into existing software architectures.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-12 border-t border-white/5 mt-20 bg-black relative z-10 select-none">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="font-bold text-xl text-white font-headline-md mb-2">Voxa</div>
            <p className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
              © 2026 Voxa AI. Pipeline Version 3.0.0-Stable
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Link className="font-mono text-[10px] text-zinc-500 hover:text-[#d0bcff] uppercase tracking-widest transition-colors animate-pulse" href="#">
              System Status: Operational
            </Link>
            <Link className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors" href="#">
              Security Spec
            </Link>
            <Link className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors" href="#">
              API Reference
            </Link>
          </div>
        </div>
      </footer>

      {/* Mobile navigation bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-16 z-50">
        <Link href="/workspace" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-medium font-sans">Workspace</span>
        </Link>
        <Link href="/technology" className="flex flex-col items-center gap-1 text-[#8b5cf6] flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">insights</span>
          <span className="text-[10px] font-medium font-sans">Pipeline</span>
        </Link>
        <Link href="/design-system" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">palette</span>
          <span className="text-[10px] font-medium font-sans">Specs</span>
        </Link>
      </div>
    </div>
  );
}
