"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { motion } from "framer-motion";
import ShaderBackground from "@/components/ui/ShaderBackground";

const features = [
  {
    icon: "bolt",
    title: "Instantaneous Inference",
    desc: "Optimized CUDA kernels deliver sub-100ms response times for real-time speech-to-speech interaction across 200+ locales.",
    accent: "group-hover:border-[#8b5cf6]/30",
    iconColor: "text-[#8b5cf6]",
  },
  {
    icon: "security",
    title: "Zero-Trust Privacy",
    desc: "Data is processed in ephemeral memory. No logs, no persistence, and enterprise-grade VPC deployment options.",
    accent: "group-hover:border-[#adc6ff]/30",
    iconColor: "text-[#adc6ff]",
  },
  {
    icon: "api",
    title: "Native Integration",
    desc: "Simple gRPC and REST APIs for seamless embedding into existing communication workflows and custom hardware.",
    accent: "group-hover:border-[#ffb869]/30",
    iconColor: "text-[#ffb869]",
  },
  {
    icon: "layers",
    title: "Model Orchestration",
    desc: "Whisper v3, NLLB-200, and proprietary transformer layers working in concert for unparalleled lexical accuracy.",
    accent: "group-hover:border-[#d0bcff]/30",
    iconColor: "text-[#d0bcff]",
  },
  {
    icon: "public",
    title: "Global Edge Nodes",
    desc: "24 regional data centers ensure low-latency connectivity regardless of where your users are located globally.",
    accent: "group-hover:border-[#3b82f6]/30",
    iconColor: "text-[#3b82f6]",
  },
  {
    icon: "monitoring",
    title: "Real-time Analytics",
    desc: "Monitor token usage, latency distribution, and sentiment across all translation pipelines via an integrated dashboard.",
    accent: "group-hover:border-[#8b5cf6]/30",
    iconColor: "text-[#8b5cf6]",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Header />
      {/* WebGL interactive background */}
      <ShaderBackground />

      <main className="bg-black text-[#e7e0ed] min-h-screen relative z-10 font-sans overflow-hidden pb-12">
        {/* Radial Purple Glow Overlay from Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_65%)] pointer-events-none z-0" />

        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6 max-w-[1200px] mx-auto text-center relative z-10">
          
          {/* Release Chip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#8b5cf6]/35 bg-[#8b5cf6]/10 text-[11px] font-mono tracking-widest text-[#d0bcff] mb-8 select-none shadow-[0_0_20px_rgba(139,92,246,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse"></span>
            VOXA PLATFORM ENGINE V3.0 ONLINE
          </motion.div>

          {/* Main Title with Elegant White-to-Purple Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-6 max-w-4xl mx-auto font-geist text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e7e0ed] to-[#d0bcff] pb-2"
          >
            Neural translation for <br className="hidden sm:inline" />
            technical scale.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-[#cbc3d7]/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            High-fidelity, real-time speech and text translation powered by distributed foundational models. Built for global connectivity and secure enterprise pipelines.
          </motion.p>

          {/* Action CTAs with Micro-Scales */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24"
          >
            <Link
              href="/workspace"
              className="bg-[#8b5cf6] text-white px-8 py-3.5 rounded-lg font-bold text-sm hover:bg-[#7c3aed] transition-all flex items-center gap-2 shadow-lg shadow-[#8b5cf6]/20 active:scale-98 select-none"
            >
              Launch Workspace
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              href="/technology"
              className="border border-white/10 bg-white/5 text-white px-8 py-3.5 rounded-lg font-bold text-sm hover:bg-white/10 hover:border-white/20 transition-all active:scale-98 select-none"
            >
              System Pipeline Architecture
            </Link>
          </motion.div>

          {/* Terminal Mockup Wrapper (adds a razor-sharp glowing frame) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto rounded-xl p-[1px] bg-gradient-to-r from-[#8b5cf6]/35 via-white/5 to-[#3b82f6]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Terminal Inner Frame */}
            <div className="relative rounded-xl bg-black/90 backdrop-blur-xl overflow-hidden">
              <div className="h-10 border-b border-white/5 flex items-center px-4 gap-1.5 bg-[#0f0d15]/50 select-none">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="ml-4 text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-mono font-medium">
                  VOXA SYSTEM INSPECTOR — NODE_NODE_JP_3
                </div>
              </div>
              
              <div className="p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex flex-col gap-5 text-left w-full md:w-1/2">
                  <div className="space-y-1.5">
                    <div className="text-[9px] text-[#adc6ff] font-mono uppercase tracking-widest font-bold">INPUT_STREAM [EN-US]</div>
                    <div className="text-white text-lg font-light font-sans leading-relaxed">
                      "Our infrastructure scales automatically."
                    </div>
                  </div>
                  <div className="h-px bg-white/5 w-full"></div>
                  <div className="space-y-1.5">
                    <div className="text-[9px] text-[#d0bcff] font-mono uppercase tracking-widest font-bold">
                      OUTPUT_STREAM [JA-JP]
                    </div>
                    <div className="text-[#d0bcff] text-lg font-light font-sans leading-relaxed">
                      "当社のインフラは自動的にスケールします。"
                    </div>
                  </div>
                </div>

                {/* Live Waveform Simulator */}
                <div className="w-full md:w-auto border border-white/5 rounded-xl p-6 bg-white/5 flex flex-col items-center gap-4 shrink-0 shadow-inner">
                  <div className="flex items-end gap-1.5 h-12 select-none">
                    <div
                      className="w-1.5 bg-[#8b5cf6] rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0s", height: "40%" }}
                    ></div>
                    <div
                      className="w-1.5 bg-[#8b5cf6] rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0.2s", height: "60%" }}
                    ></div>
                    <div
                      className="w-1.5 bg-[#adc6ff] rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0.1s", height: "80%" }}
                    ></div>
                    <div
                      className="w-1.5 bg-[#8b5cf6] rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0.4s", height: "30%" }}
                    ></div>
                    <div
                      className="w-1.5 bg-[#8b5cf6] rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0.3s", height: "70%" }}
                    ></div>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 tracking-widest">LATENCY: 42ms</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Premium Grid */}
        <section className="max-w-[1200px] mx-auto px-6 py-24 border-t border-white/5 relative z-10">
          <div className="mb-12 text-center md:text-left">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/50 border-l-2 border-[#8b5cf6] pl-4">Capabilities</span>
            <h2 className="text-3xl font-semibold font-geist text-white mt-3 tracking-tight">Full stack neural interpretation.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`premium-card p-8 flex flex-col gap-6 group hover:border-[#8b5cf6]/30 transition-all duration-300 relative overflow-hidden`}
              >
                {/* Subtle gradient hover background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.03),transparent_40%)] pointer-events-none" />
                
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#8b5cf6]/10 select-none">
                  <span className={`material-symbols-outlined text-xl ${feat.iconColor}`}>{feat.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white font-geist group-hover:text-[#d0bcff] transition-colors">{feat.title}</h3>
                  <p className="text-[#cbc3d7]/70 text-sm leading-relaxed font-light font-sans">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="max-w-[1200px] mx-auto px-6 py-24 border-t border-white/5 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/50 border-l-2 border-[#8b5cf6] pl-4">Reliability metrics</span>
              <h2 className="text-3xl font-bold tracking-tight text-white font-geist mt-3 mb-6">Engineered for high-availability.</h2>
              <p className="text-[#cbc3d7]/80 mb-8 leading-relaxed font-light font-sans">
                Voxa handles over 100 million translations daily with a 99.99% uptime SLA. Our infrastructure is built to scale from individual developers to global enterprise setups.
              </p>
              <div className="flex flex-wrap gap-x-12 gap-y-8 select-none">
                <div>
                  <div className="text-3xl font-bold text-[#d0bcff] font-geist">99.99%</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-1">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#adc6ff] font-geist">12ms</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-1">Avg Jitter</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#ffb869] font-geist">200+</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-1">Languages</div>
                </div>
              </div>
            </div>

            {/* Spec grid cells */}
            <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
              <div className="premium-card p-8 flex flex-col items-center justify-center text-center group hover:border-[#8b5cf6]/30 transition-all select-none">
                <span className="material-symbols-outlined text-[#8b5cf6] text-3xl mb-4">memory</span>
                <div className="text-xs uppercase font-mono tracking-widest text-white">H100 Optimized</div>
              </div>
              <div className="premium-card p-8 flex flex-col items-center justify-center text-center group hover:border-[#adc6ff]/30 transition-all select-none">
                <span className="material-symbols-outlined text-[#adc6ff] text-3xl mb-4">cloud</span>
                <div className="text-xs uppercase font-mono tracking-widest text-white">Hybrid Cloud</div>
              </div>
              <div className="premium-card p-8 flex flex-col items-center justify-center text-center group hover:border-[#ffb869]/30 transition-all select-none">
                <span className="material-symbols-outlined text-[#ffb869] text-3xl mb-4">terminal</span>
                <div className="text-xs uppercase font-mono tracking-widest text-white">CLI Core SDK</div>
              </div>
              <div className="premium-card p-8 flex flex-col items-center justify-center text-center group hover:border-[#d0bcff]/30 transition-all select-none">
                <span className="material-symbols-outlined text-[#d0bcff] text-3xl mb-4">hub</span>
                <div className="text-xs uppercase font-mono tracking-widest text-white">Edge nodes</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA wrapped inside a premium glowing container */}
        <section className="max-w-[1200px] mx-auto px-6 py-12 relative z-10">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-[#8b5cf6]/30 via-white/5 to-[#adc6ff]/20 overflow-hidden shadow-2xl">
            {/* CTA backdrop blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(139,92,246,0.1),transparent_50%)]" />

            <div className="relative z-10 px-8 py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-white font-geist">Scale your communication infrastructure.</h2>
              <p className="text-[#cbc3d7]/70 mb-10 max-w-xl mx-auto font-light font-sans">
                Start building with the Voxa API today. First 1,000 requests are free of charge.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/workspace"
                  className="bg-[#8b5cf6] text-white px-10 py-3.5 rounded-lg font-bold hover:bg-[#7c3aed] transition-colors text-sm shadow-lg shadow-[#8b5cf6]/10 active:scale-98"
                >
                  Start Session
                </Link>
                <Link
                  href="/workspace"
                  className="border border-white/10 bg-white/5 text-[#cbc3d7] px-10 py-3.5 rounded-lg font-bold hover:bg-white/10 transition-colors text-sm active:scale-98"
                >
                  Talk to an expert
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-[#cbc3d7] relative z-10 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-white group">
              <div className="w-8 h-8 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLuKVSk3_84_5GQ6VkK2082k2yi4ZiupJd9HG6EFX_8ZdPjwMZ0pLB9YafMoTihOJwySlqPC8GR_ysGt6qanmSuH3t0OgpcAsHo_JkfRvhqb2XSZOGNqnsNNnHc4yj2BKgPqtrsSHLUsfnNcL6VIJQFqaFU51fidPBqq50VrfNldOBJEFxfdb-9Byi7HcQqBxZpgL9YnhDIkarAFkZnrdwPiDUPTpeQziyaJdyrhHuLsyC_MvFuOTOSzWw" 
                  alt="Voxa Logo" 
                  className="w-5 h-5 object-contain"
                />
              </div>
              <span className="font-bold text-white font-headline-md">Voxa</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed font-light font-sans">
              Building the future of neural translation and global communication infrastructure.
            </p>
            {/* Customized Developer Signature */}
            <div className="flex flex-col items-start gap-1 py-1 select-none pt-4">
              <p className="text-xs text-zinc-500 font-mono tracking-wider leading-relaxed">
                Fueled by <span className="text-[#ffb869] font-semibold">Diet Coke</span> 🥤 &amp; <span className="text-[#8b5cf6] font-semibold">iterating minds</span> 🧠
              </p>
              <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase mt-0.5">
                — Priyanshu Raj
              </p>
            </div>
            {/* Social Platform Links */}
            <div className="flex items-center gap-4.5 text-zinc-500 mt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077b5] transition-all hover:scale-110 duration-200" title="LinkedIn Profile">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com/priyanshuraj20" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all hover:scale-110 duration-200" title="GitHub Profile">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e1306c] transition-all hover:scale-110 duration-200" title="Instagram Profile">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="mailto:priyanshuraj.work@gmail.com" className="hover:text-[#8b5cf6] transition-all hover:scale-110 duration-200" title="Send Email">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 font-sans">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#cbc3d7]/30">Product</h4>
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
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#cbc3d7]/30">Resources</h4>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                API Reference
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                System Status
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#cbc3d7]/30">Company</h4>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Security Policy
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <div>© 2026 Voxa AI. All rights reserved.</div>
          <div className="flex gap-6 font-mono text-[10px]">
            <Link href="#" className="hover:text-[#d0bcff] transition-colors">PRIVACY_POLICY</Link>
            <Link href="#" className="hover:text-[#d0bcff] transition-colors">TERMS_OF_SERVICE</Link>
            <Link href="#" className="hover:text-[#d0bcff] transition-colors">GDPR_COMPLIANCE</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
