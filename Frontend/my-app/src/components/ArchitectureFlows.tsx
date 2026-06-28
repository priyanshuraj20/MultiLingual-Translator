"use client";

import React, { useState } from "react";

/**
 * ARCHITECTURE FLOWS COMPONENT
 * 
 * WHY THIS WAS MODULARIZED:
 * The interactive pipeline flowcharts section involves tab states, simulation event triggers (browser SpeechSynthesis), 
 * and large ASCII schematics. Moving it into a standalone component isolates client-side events, decreases bundle size, 
 * and improves compile optimization.
 */
export default function ArchitectureFlows() {
  const [activeFlow, setActiveFlow] = useState<"meeting" | "practice" | "parallel">("meeting");

  return (
    <section id="architecture" className="max-w-[1200px] mx-auto px-6 py-24 border-t border-white/5 relative z-10">
      <div className="mb-16 text-center">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/50 border-l-2 border-[#8b5cf6] pl-4">System Architecture</span>
        <h2 className="text-3xl md:text-4xl font-semibold font-geist text-white mt-3 tracking-tight">Under the hood.</h2>
        <p className="text-sm text-[#cbc3d7]/70 mt-3 max-w-xl mx-auto font-light leading-relaxed">
          Voxa uses a decoupled microservice model. Raw browser tab sound is intercepted, packaged, and routed in parallel.
        </p>
      </div>

      {/* 4 Steps Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        
        {/* Card 1 */}
        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white/3 border border-white/5 relative group hover:border-[#8b5cf6]/35 transition-all select-none">
          <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center font-mono font-bold text-lg text-[#d0bcff]">
            01
          </div>
          <h3 className="font-bold text-lg text-white font-geist">Browser Capture</h3>
          <p className="text-xs text-[#cbc3d7]/70 leading-relaxed font-sans font-light">
            Chrome's tab capture intercept API grabs raw system audio from meeting tabs (Google Meet / Zoom client) downsampled to 16kHz PCM.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white/3 border border-white/5 relative group hover:border-[#adc6ff]/35 transition-all select-none">
          <div className="w-12 h-12 rounded-xl bg-[#adc6ff]/10 border border-[#adc6ff]/20 flex items-center justify-center font-mono font-bold text-lg text-[#adc6ff]">
            02
          </div>
          <h3 className="font-bold text-lg text-white font-geist">WebSocket Stream</h3>
          <p className="text-xs text-[#cbc3d7]/70 leading-relaxed font-sans font-light">
            Continuous raw voice buffers are chunked and streamed directly via secure WebSockets to our core FastAPI backend orchestration server.
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white/3 border border-white/5 relative group hover:border-[#ffb869]/35 transition-all select-none">
          <div className="w-12 h-12 rounded-xl bg-[#ffb869]/10 border border-[#ffb869]/20 flex items-center justify-center font-mono font-bold text-lg text-[#ffb869]">
            03
          </div>
          <h3 className="font-bold text-lg text-white font-geist">Neural Parsing Cores</h3>
          <p className="text-xs text-[#cbc3d7]/70 leading-relaxed font-sans font-light">
            Whisper transcribes audio, Punctuation AI formats casing, and NLLB-200 translates. Pipelines run asynchronously in thread executors.
          </p>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white/3 border border-white/5 relative group hover:border-emerald-500/35 transition-all select-none">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-lg text-emerald-400">
            04
          </div>
          <h3 className="font-bold text-lg text-white font-geist">Audio Playback</h3>
          <p className="text-xs text-[#cbc3d7]/70 leading-relaxed font-sans font-light mb-2">
            The target translation text is synthesized using ElevenLabs TTS, or local browser speechSynthesis, and broadcast to the user.
          </p>
          <button 
            onClick={() => {
              if (typeof window !== "undefined" && window.speechSynthesis) {
                const synth = window.speechSynthesis;
                const utterance = new SpeechSynthesisUtterance("Hola a todos");
                utterance.lang = "es-ES";
                synth.speak(utterance);
              }
            }}
            className="mt-auto py-2.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">volume_up</span>
            Simulate Voice Output
          </button>
        </div>

      </div>

      {/* Interactive Tabs */}
      <div className="premium-card p-6 md:p-8 bg-[#0a0a0c]/40 border border-white/5 rounded-xl">
        <div className="mb-10 text-center">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/50 border-l-2 border-[#adc6ff] pl-4">Interactive Pipeline Flowcharts</span>
          <h3 className="text-2xl font-semibold font-geist text-white mt-2 tracking-tight">Toggle between different system flows</h3>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 select-none">
          <button 
            onClick={() => setActiveFlow("meeting")}
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all border ${
              activeFlow === "meeting" 
                ? "bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/20 font-bold scale-105" 
                : "bg-white/5 border-white/10 text-[#cbc3d7] hover:bg-white/10"
            }`}
          >
            HINDI ➔ ENGLISH (MEETING MODE)
          </button>
          <button 
            onClick={() => setActiveFlow("practice")}
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all border ${
              activeFlow === "practice" 
                ? "bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/20 font-bold scale-105" 
                : "bg-white/5 border-white/10 text-[#cbc3d7] hover:bg-white/10"
            }`}
          >
            ENGLISH ➔ SPANISH (PRACTICE MODE)
          </button>
          <button 
            onClick={() => setActiveFlow("parallel")}
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all border ${
              activeFlow === "parallel" 
                ? "bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/20 font-bold scale-105" 
                : "bg-white/5 border-white/10 text-[#cbc3d7] hover:bg-white/10"
            }`}
          >
            FASTAPI PARALLEL ORCHESTRATION
          </button>
        </div>

        {/* Flow Viewer */}
        <div className="premium-card p-8 border border-white/5 bg-black/40 backdrop-blur-xl rounded-xl">
          {activeFlow === "meeting" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs uppercase font-mono text-[#adc6ff]">Active Flow: Hindi ➔ English Meeting Intercept</span>
                <span className="text-[10px] text-zinc-500 font-mono">Real-Time Meeting Subtitles</span>
              </div>
              
              <div className="flex flex-col gap-4 max-w-lg mx-auto w-full">
                
                {/* Node 1 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-8 h-8 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#d0bcff] font-bold text-xs flex items-center justify-center flex-shrink-0">1</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Source Input</span>
                    <span className="text-sm font-semibold text-white">USER speaks in Hindi ("Namaste, aap kaise ho")</span>
                  </div>
                </div>
                
                <div className="flex justify-center text-zinc-600 font-bold text-sm">▼</div>
                
                {/* Node 2 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-8 h-8 rounded-full bg-[#adc6ff]/10 border border-[#adc6ff]/20 text-[#adc6ff] font-bold text-xs flex items-center justify-center flex-shrink-0">2</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Browser Context</span>
                    <span className="text-sm font-semibold text-white">chrome.tabCapture grabs active Google Meet sound</span>
                  </div>
                </div>
                
                <div className="flex justify-center text-zinc-600 font-bold text-sm">▼</div>
                
                {/* Node 3 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-8 h-8 rounded-full bg-[#ffb869]/10 border border-[#ffb869]/20 text-[#ffb869] font-bold text-xs flex items-center justify-center flex-shrink-0">3</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">WebSocket Stream</span>
                    <span className="text-sm font-semibold text-white">Continuous PCM wav chunks uploaded to FastAPI</span>
                  </div>
                </div>
                
                <div className="flex justify-center text-zinc-600 font-bold text-sm">▼</div>
                
                {/* Node 4 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-8 h-8 rounded-full bg-[#d0bcff]/10 border border-[#d0bcff]/20 text-[#d0bcff] font-bold text-xs flex items-center justify-center flex-shrink-0">4</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Neural Interpretation</span>
                    <span className="text-sm font-semibold text-white">Whisper v3 transcribes audio & NLLB-200 translates to English</span>
                  </div>
                </div>
                
                <div className="flex justify-center text-zinc-600 font-bold text-sm">▼</div>
                
                {/* Node 5 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0">5</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Vocal Output</span>
                    <span className="text-sm font-semibold text-white">ElevenLabs TTS speaks translation ("Hello, how are you?")</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeFlow === "practice" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs uppercase font-mono text-[#ffb869]">Active Flow: English ➔ Spanish Practice Room</span>
                <span className="text-[10px] text-zinc-500 font-mono">Microphone Speech Practice (10 Steps)</span>
              </div>
              <div className="flex flex-col gap-3 max-w-xl mx-auto w-full">
                
                {/* Step 1 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#d0bcff] font-bold text-xs flex items-center justify-center flex-shrink-0">1</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">USER</span>
                    <span className="text-xs font-semibold text-white">Speaks English naturally through device mic</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 2 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#adc6ff]/10 border border-[#adc6ff]/20 text-[#adc6ff] font-bold text-xs flex items-center justify-center flex-shrink-0">2</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Browser Context</span>
                    <span className="text-xs font-semibold text-white">Browser Microphone Interception (GetUserMedia API)</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 3 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#ffb869]/10 border border-[#ffb869]/20 text-[#ffb869] font-bold text-xs flex items-center justify-center flex-shrink-0">3</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Audio Interface</span>
                    <span className="text-xs font-semibold text-white">MediaRecorder API buffers raw voice stream input</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 4 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#d0bcff]/10 border border-[#d0bcff]/20 text-[#d0bcff] font-bold text-xs flex items-center justify-center flex-shrink-0">4</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Payload Capture</span>
                    <span className="text-xs font-semibold text-white">Generates Audio Blob payload format (.webm packets)</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 5 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] font-bold text-xs flex items-center justify-center flex-shrink-0">5</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Gateway Stream</span>
                    <span className="text-xs font-semibold text-white">FastAPI Server processes binary WebSocket packets</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 6 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#d0bcff] font-bold text-xs flex items-center justify-center flex-shrink-0">6</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">ASR Core Engine</span>
                    <span className="text-xs font-semibold text-white">Whisper ASR transcribes voice to string: "Hello everyone"</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 7 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#adc6ff]/10 border border-[#adc6ff]/20 text-[#adc6ff] font-bold text-xs flex items-center justify-center flex-shrink-0">7</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Syntax Formatting</span>
                    <span className="text-xs font-semibold text-white">Punctuation AI restores punctuation: "Hello, everyone."</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 8 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#ffb869]/10 border border-[#ffb869]/20 text-[#ffb869] font-bold text-xs flex items-center justify-center flex-shrink-0">8</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Machine Translation</span>
                    <span className="text-xs font-semibold text-white">NLLB translation maps source text to target Spanish: "Hola a todos."</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 9 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#d0bcff]/10 border border-[#d0bcff]/20 text-[#d0bcff] font-bold text-xs flex items-center justify-center flex-shrink-0">9</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Payload Response</span>
                    <span className="text-xs font-semibold text-white">FastAPI sends unified JSON response text back to Next.js UI</span>
                  </div>
                </div>
                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Step 10 */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0">10</div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Browser Output</span>
                    <span className="text-xs font-semibold text-white">Browser SpeechSynthesis plays translated voice: 🔊 "Hola a todos."</span>
                  </div>
                </div>

              </div>

              {/* ASCII Diagram Visual */}
              <div className="mt-8 border-t border-white/5 pt-8">
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-4 text-center">Visual Schematic Flow</span>
                <pre className="font-mono text-xs bg-black/60 p-6 rounded-lg text-[#adc6ff] border border-white/5 whitespace-pre overflow-x-auto text-left leading-relaxed">
{`                 USER
                  │
           Speaks English
                  │
                  ▼
        Browser Microphone
                  │
                  ▼
          MediaRecorder API
                  │
                  ▼
          Audio Blob (.webm)
                  │
                  ▼
             FastAPI Server
                  │
                  ▼
              Whisper ASR
                  │
                  ▼
         "Hello everyone"
                  │
                  ▼
      Punctuation Restoration
                  │
                  ▼
     "Hello, everyone."
                  │
                  ▼
          NLLB Translation
                  │
                  ▼
      "Hola a todos."
                  │
                  ▼
         JSON Response
                  │
                  ▼
            Next.js UI
                  │
                  ▼
    Browser SpeechSynthesis
                  │
                  ▼
      🔊 "Hola a todos."`}
                </pre>
              </div>

            </div>
          )}

          {activeFlow === "parallel" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs uppercase font-mono text-[#d0bcff]">Active Flow: FastAPI Server Parallel Orchestration</span>
                <span className="text-[10px] text-zinc-500 font-mono">Modular Independent Processing</span>
              </div>
              
              {/* Outer Frame Wrapper */}
              <div className="flex flex-col gap-6 w-full font-sans">
                
                {/* Top Layer: Capture */}
                <div className="flex flex-col items-center max-w-lg mx-auto w-full gap-3 p-4 rounded-lg bg-white/3 border border-white/5">
                  <span className="text-[9px] text-[#8b5cf6] font-mono uppercase tracking-widest font-bold">CLIENT INPUT GATEWAY</span>
                  <span className="text-xs font-semibold text-white text-center">
                    USER speaks ➔ Browser (MediaRecorder API) ➔ WebM Audio Recording Chunks
                  </span>
                </div>

                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Middle Layer: Parallel Engines Split Card */}
                <div className="p-6 rounded-xl bg-[#0f0d15]/50 border border-white/5">
                  <div className="text-[9px] text-zinc-500 font-mono uppercase text-center mb-6 tracking-widest">FASTAPI BACKEND PARALLEL ROUTING</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Box 1 */}
                    <div className="p-5 rounded-lg bg-white/3 border border-[#8b5cf6]/20 flex flex-col gap-2 shadow-lg">
                      <div className="text-[8px] font-mono text-[#8b5cf6] uppercase tracking-wider">Pipeline Engine A</div>
                      <h4 className="font-semibold text-white text-xs uppercase font-mono">Whisper ASR</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">Transcribes the incoming WebM speech bytes into raw text.</p>
                      <div className="mt-4 pt-2 border-t border-white/5 font-mono text-[9px] text-[#adc6ff]">&gt; Output: Transcribed Text</div>
                    </div>

                    {/* Box 2 */}
                    <div className="p-5 rounded-lg bg-white/3 border border-[#adc6ff]/20 flex flex-col gap-2 shadow-lg">
                      <div className="text-[8px] font-mono text-[#adc6ff] uppercase tracking-wider">Pipeline Engine B</div>
                      <h4 className="font-semibold text-white text-xs uppercase font-mono">Punctuation AI</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">Cleans transcribed text and restores correct symbols and casing.</p>
                      <div className="mt-4 pt-2 border-t border-white/5 font-mono text-[9px] text-[#ffb869]">&gt; Output: Cleaned Text</div>
                    </div>

                    {/* Box 3 */}
                    <div className="p-5 rounded-lg bg-white/3 border border-[#ffb869]/20 flex flex-col gap-2 shadow-lg">
                      <div className="text-[8px] font-mono text-[#ffb869] uppercase tracking-wider">Pipeline Engine C</div>
                      <h4 className="font-semibold text-white text-xs uppercase font-mono">NLLB Translator</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">Maps source text into target translations over 200 locales.</p>
                      <div className="mt-4 pt-2 border-t border-white/5 font-mono text-[9px] text-[#d0bcff]">&gt; Output: Translated Text</div>
                    </div>

                  </div>
                </div>

                <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                {/* Bottom Layer: Consolidated Output */}
                <div className="flex flex-col gap-4 max-w-lg mx-auto w-full">
                  <div className="p-4 rounded-lg bg-white/3 border border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Consolidated Response</span>
                      <span className="text-xs font-semibold text-white">FastAPI sends unified JSON response data to Browser</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#adc6ff]/10 text-[#adc6ff] font-mono text-[9px]">JSON Payload</span>
                  </div>

                  <div className="text-center text-[#8b5cf6] text-xs leading-none">▼</div>

                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 shadow-lg">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">volume_up</span>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider">Vocal Rendering</span>
                      <span className="text-xs font-semibold text-white">Browser Speech Synthesis API plays translated voice output</span>
                    </div>
                  </div>
                </div>

                {/* ASCII Diagram Visual */}
                <div className="mt-8 border-t border-white/5 pt-8">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-4 text-center">Visual Schematic Flow</span>
                  <pre className="font-mono text-xs bg-black/60 p-6 rounded-lg text-[#adc6ff] border border-white/5 whitespace-pre overflow-x-auto text-left leading-relaxed">
{`                    USER
                      │
          Speaks through Microphone
                      │
                      ▼
        Browser (MediaRecorder API)
                      │
                      ▼
               Audio Recording
                      │
                      ▼
            FastAPI Backend Server
      ┌──────────────┼────────────────┐
      │              │                │
      ▼              ▼                ▼
 Whisper ASR   Punctuation AI    NLLB Translator
      │
      ▼
   Transcribed Text
      │
      ▼
 Cleaned Text
      │
      ▼
 Translated Text
      │
      ▼
 JSON Response
      │
      ▼
 Browser
      │
      ▼
 Speech Synthesis API
      │
      ▼
 Translated Voice Output`}
                  </pre>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
