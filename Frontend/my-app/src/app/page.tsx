"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Header />
      <main className="bg-black text-white min-h-screen">
        {/* Hero Section */}
        <section
          className={`pt-40 pb-24 px-6 max-w-[1200px] mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Release Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[12px] font-medium tracking-tight mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2f54eb] animate-pulse"></span>
            LIVELINGUA ENGINE V3.0 NOW AVAILABLE
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6 max-w-4xl mx-auto">
            Neural translation for <br className="hidden sm:inline" />
            technical scale.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            High-fidelity, real-time speech and text translation powered by distributed foundational models. Built for global enterprise connectivity.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
            <Link
              href="/workspace"
              className="bg-white text-black px-8 py-3 rounded font-medium text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              Deploy Now
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              href="/technology"
              className="border border-white/10 px-8 py-3 rounded font-medium text-sm hover:bg-white/5 transition-colors"
            >
              Read Documentation
            </Link>
          </div>

          {/* Terminal Visualization */}
          <div className="relative max-w-4xl mx-auto border border-white/10 rounded-lg bg-[#0a0a0a] overflow-hidden shadow-2xl">
            <div className="h-8 border-b border-white/10 flex items-center px-4 gap-1.5 bg-black/40">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="ml-4 text-[10px] text-white/30 uppercase tracking-widest font-mono font-medium">
                Session Inspector — Tokyo Node
              </div>
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex flex-col gap-4 text-left w-full md:w-1/2">
                <div className="space-y-1">
                  <div className="text-[10px] text-white/40 font-mono">INPUT_STREAM [EN-US]</div>
                  <div className="text-white text-lg font-medium">"Our infrastructure scales automatically."</div>
                </div>
                <div className="h-px bg-white/5 w-full"></div>
                <div className="space-y-1">
                  <div className="text-[10px] text-[#2f54eb] font-mono uppercase tracking-widest">
                    Output_Stream [JA-JP]
                  </div>
                  <div className="text-white text-lg font-medium">
                    "当社のインフラは自動的にスケールします。"
                  </div>
                </div>
              </div>

              {/* Live Waveform Simulator */}
              <div className="w-full md:w-auto border border-white/10 rounded p-6 bg-black flex flex-col items-center gap-4 shrink-0">
                <div className="flex items-end gap-1 h-12">
                  <div
                    className="w-1.5 bg-[#2f54eb] rounded-full animate-waveform-jump"
                    style={{ animationDelay: "0s", height: "40%" }}
                  ></div>
                  <div
                    className="w-1.5 bg-[#2f54eb] rounded-full animate-waveform-jump"
                    style={{ animationDelay: "0.2s", height: "60%" }}
                  ></div>
                  <div
                    className="w-1.5 bg-[#2f54eb] rounded-full animate-waveform-jump"
                    style={{ animationDelay: "0.1s", height: "80%" }}
                  ></div>
                  <div
                    className="w-1.5 bg-[#2f54eb] rounded-full animate-waveform-jump"
                    style={{ animationDelay: "0.4s", height: "30%" }}
                  ></div>
                  <div
                    className="w-1.5 bg-[#2f54eb] rounded-full animate-waveform-jump"
                    style={{ animationDelay: "0.3s", height: "70%" }}
                  ></div>
                </div>
                <div className="text-[11px] font-mono text-zinc-500">LATENCY: 42ms</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Strict Grid */}
        <section className="max-w-[1200px] mx-auto px-6 py-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {/* Feature 1 */}
            <div className="bg-black p-8 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors">
              <span className="material-symbols-outlined text-[#2f54eb] text-2xl">bolt</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Instantaneous Inference</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Optimized CUDA kernels deliver sub-100ms response times for real-time speech-to-speech interaction across 200+ locales.
                </p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="bg-black p-8 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors">
              <span className="material-symbols-outlined text-[#2f54eb] text-2xl">security</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Zero-Trust Privacy</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Data is processed in ephemeral memory. No logs, no persistence, and enterprise-grade VPC deployment options.
                </p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="bg-black p-8 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors">
              <span className="material-symbols-outlined text-[#2f54eb] text-2xl">api</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Native Integration</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Simple gRPC and REST APIs for seamless embedding into existing communication workflows and custom hardware.
                </p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="bg-black p-8 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors">
              <span className="material-symbols-outlined text-[#2f54eb] text-2xl">layers</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Model Orchestration</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Whisper v3, NLLB-200, and proprietary transformer layers working in concert for unparalleled lexical accuracy.
                </p>
              </div>
            </div>
            {/* Feature 5 */}
            <div className="bg-black p-8 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors">
              <span className="material-symbols-outlined text-[#2f54eb] text-2xl">public</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Global Edge Nodes</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  24 regional data centers ensure low-latency connectivity regardless of where your users are located globally.
                </p>
              </div>
            </div>
            {/* Feature 6 */}
            <div className="bg-black p-8 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors">
              <span className="material-symbols-outlined text-[#2f54eb] text-2xl">monitoring</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Real-time Analytics</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Monitor token usage, latency distribution, and sentiment across all translation pipelines via an integrated dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="max-w-[1200px] mx-auto px-6 py-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Engineered for high-availability.</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                LiveLingua handles over 100 million translations daily with a 99.99% uptime SLA. Our infrastructure is built to scale from individual users to Fortune 500 enterprises.
              </p>
              <div className="flex flex-wrap gap-x-12 gap-y-8">
                <div>
                  <div className="text-3xl font-bold">99.99%</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mt-1">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">12ms</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mt-1">Avg Jitter</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mt-1">Languages</div>
                </div>
              </div>
            </div>

            {/* Spec grid cells */}
            <div className="md:w-1/2 w-full grid grid-cols-2 gap-px bg-white/10 border border-white/10">
              <div className="bg-black p-10 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-white/20 text-4xl mb-4">memory</span>
                <div className="text-sm font-medium">H100 Optimized</div>
              </div>
              <div className="bg-black p-10 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-white/20 text-4xl mb-4">cloud</span>
                <div className="text-sm font-medium">Hybrid Multi-cloud</div>
              </div>
              <div className="bg-black p-10 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-white/20 text-4xl mb-4">terminal</span>
                <div className="text-sm font-medium">CLI Integration</div>
              </div>
              <div className="bg-black p-10 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-white/20 text-4xl mb-4">hub</span>
                <div className="text-sm font-medium">Auto-scaling Hub</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-y border-white/5 bg-white/[0.01] py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Scale your communication infrastructure.</h2>
            <p className="text-zinc-400 mb-10">Start building with the LiveLingua API today. First 1,000 requests are free of charge.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/workspace"
                className="bg-white text-black px-10 py-3 rounded font-medium hover:bg-zinc-200 transition-colors text-sm"
              >
                Start for free
              </Link>
              <Link
                href="/workspace"
                className="border border-white/10 px-10 py-3 rounded font-medium hover:bg-white/5 transition-colors text-sm"
              >
                Talk to an expert
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-6 py-12 bg-black text-white">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold tracking-tight">LiveLingua</div>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
              Building the future of neural translation and global communication infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Product</h4>
              <Link href="/workspace" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Translation API
              </Link>
              <Link href="/workspace" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Vocal Engine
              </Link>
              <Link href="/workspace" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Real-time Suite
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Resources</h4>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                API Reference
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Status
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Company</h4>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Security
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <div>© 2026 LiveLingua AI. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Compliance</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
