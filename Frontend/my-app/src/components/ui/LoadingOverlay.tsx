"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomAIFact } from "@/constants/aiFacts";

const loadingStatuses = [
  "Initializing Voxa...",
  "Preparing Workspace...",
  "Loading AI Models...",
  "Connecting Translation Engine...",
  "Preparing Speech Recognition...",
  "Loading Neural Translation...",
  "Initializing Voice Synthesis...",
  "Preparing Chrome Extension...",
  "Building Workspace...",
  "Optimizing Audio Pipeline...",
  "Loading Developer APIs...",
  "Preparing Browser Extension...",
  "Loading Components...",
  "Rendering Interface...",
  "Almost Ready...",
  "Finalizing Session...",
];

const subtleIcons = ["🎤", "🧠", "🌍", "⚡", "🔊", "💬"];

export default function LoadingOverlay() {
  const [status, setStatus] = useState("Initializing Voxa...");
  const [aiFact, setAiFact] = useState("");
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    // Select one random AI fact for this loading session to allow reading time
    setAiFact(getRandomAIFact());

    // Cycle through status messages randomly every 1.5 seconds
    const statusInterval = setInterval(() => {
      setStatus((prev) => {
        let nextStatus = loadingStatuses[Math.floor(Math.random() * loadingStatuses.length)];
        // Prevent picking the exact same message back-to-back
        while (nextStatus === prev) {
          nextStatus = loadingStatuses[Math.floor(Math.random() * loadingStatuses.length)];
        }
        return nextStatus;
      });
    }, 1500);

    // Cycle subtle bottom icons every 800ms
    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % subtleIcons.length);
    }, 800);

    return () => {
      clearInterval(statusInterval);
      clearInterval(iconInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#000000] z-[9999] flex flex-col justify-between items-center py-16 px-6 select-none font-sans overflow-hidden">
      {/* Absolute top grid details to look highly professional */}
      <div className="w-full max-w-[1200px] flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
        <span>VOXA SECURE_TUNNEL: ENCRYPTED</span>
        <span>NODE: LAUNCH_CORE_V3</span>
      </div>

      {/* Main Core Center Area */}
      <div className="flex flex-col items-center justify-center gap-8 max-w-sm text-center">
        {/* Voxa Logo from Google User Content */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden shadow-2xl relative z-10"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AP1WRLuKVSk3_84_5GQ6VkK2082k2yi4ZiupJd9HG6EFX_8ZdPjwMZ0pLB9YafMoTihOJwySlqPC8GR_ysGt6qanmSuH3t0OgpcAsHo_JkfRvhqb2XSZOGNqnsNNnHc4yj2BKgPqtrsSHLUsfnNcL6VIJQFqaFU51fidPBqq50VrfNldOBJEFxfdb-9Byi7HcQqBxZpgL9YnhDIkarAFkZnrdwPiDUPTpeQziyaJdyrhHuLsyC_MvFuOTOSzWw"
              alt="Voxa Logo"
              className="w-12 h-12 object-contain"
            />
          </motion.div>
          {/* Subtle neon drop shadow behind logo */}
          <div className="absolute inset-0 w-16 h-16 bg-[#8b5cf6]/10 blur-xl rounded-full scale-110 pointer-events-none z-0" />
        </div>

        {/* Dynamic Title / Status */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="font-geist text-[15px] text-white font-medium tracking-tight"
            >
              {status}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Indeterminate linear progress bar */}
        <div className="w-64 h-1 bg-white/10 overflow-hidden relative rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#adc6ff] w-1/3 rounded-full absolute left-0"
            animate={{ left: ["-33%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>

        {/* Random AI Fact panel */}
        {aiFact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-5 border border-white/10 bg-white/[0.04] rounded-xl text-center w-full max-w-sm shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md"
          >
            <span className="font-mono text-[10px] text-[#adc6ff] uppercase tracking-[0.22em] block mb-2 font-bold">
              Cognitive Insight
            </span>
            <p className="text-[13.5px] text-zinc-200 font-normal font-sans leading-relaxed">
              {aiFact}
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom subtle animated icon loader */}
      <div className="flex flex-col items-center gap-2 select-none">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5 shadow-inner overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={iconIndex}
              initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotate: 15 }}
              transition={{ duration: 0.25 }}
              className="text-base"
            >
              {subtleIcons[iconIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#cbc3d7]/30 font-bold">
          Neural Node Stream
        </span>
      </div>
    </div>
  );
}
