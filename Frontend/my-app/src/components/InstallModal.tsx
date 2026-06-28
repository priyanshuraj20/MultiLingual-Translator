"use client";

import React from "react";
import Link from "next/link";

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * INSTALL MODAL COMPONENT
 * 
 * WHY THIS WAS MODULARIZED:
 * The setup guide is a distinct, heavy visual overlay that is reuseable across the Landing Page 
 * and the Workspace Dashboard. Extracting it prevents code duplication and keeps parent page 
 * sizes small and clean.
 */
export default function InstallModal({ isOpen, onClose }: InstallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl bg-[#0f0d15]/95 border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Left Side: Setup Graphic Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white/3 border border-white/5 rounded-xl p-4 overflow-hidden">
          <img 
            src="/setup_guide.png" 
            alt="Chrome Extensions Setup Guide" 
            className="w-full h-auto object-contain rounded-lg shadow-lg border border-white/5"
          />
        </div>

        {/* Right Side: Install details & Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
          <div>
            <span className="text-[9px] font-mono text-[#adc6ff] uppercase tracking-widest block mb-2">QUICK SETUP GUIDE</span>
            <h3 className="text-2xl font-bold text-white font-geist mb-4">Install Voxa Extension</h3>
            
            {/* Quick Steps */}
            <ol className="text-xs text-zinc-400 space-y-3 leading-relaxed mb-6 list-decimal list-inside">
              <li>Download the packed <strong>Voxa.zip</strong> extension.</li>
              <li>Extract/unzip the file to a local folder.</li>
              <li>Open <strong>chrome://extensions</strong> in your browser.</li>
              <li>Enable <strong>Developer Mode</strong> (top right).</li>
              <li>Click <strong>Load Unpacked</strong> and select the folder.</li>
              <li><strong>Open Dashboard</strong>: Click the pinned Voxa toolbar icon to open the side panel dashboard.</li>
              <li><strong>Start Translation</strong>: Press <strong>Ctrl + Shift + U</strong> (or right-click 'Activate Voxa Capture') on your meeting page and click <strong>Start Capturing</strong>.</li>
            </ol>

            {/* Facts info box */}
            <div className="bg-white/3 border border-white/5 rounded-lg p-3 text-[11px] text-[#ffb869] font-mono mb-6">
              💡 Voxa requires Developer Mode to load custom audio capture libraries. Secure License Token will sync on launch.
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href="/Voxa.zip" 
              download="Voxa.zip" 
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 px-4 rounded-lg font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-[#8b5cf6]/20 transition-all duration-255"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download Extension Package
            </a>
            <Link 
              href="/workspace" 
              onClick={onClose}
              className="border border-white/10 bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-lg font-bold text-sm text-center flex items-center justify-center gap-2 transition-all duration-255"
            >
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              Try it out (Workspace)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
