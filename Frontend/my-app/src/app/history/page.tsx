"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import ShaderBackground from "@/components/ui/ShaderBackground";

interface Session {
  id: string;
  name: string;
  fromLang: string;
  toLang: string;
  pairingType: "arrow" | "swap";
  duration: string;
  date: string;
  icon: string;
  iconColor: string;
  accuracy: string;
  latency: string;
  wordCount: string;
  isStarred?: boolean;
}

const mockSessions: Session[] = [
  {
    id: "1",
    name: "Business Strategic Review",
    fromLang: "ENG",
    toLang: "MAN",
    pairingType: "arrow",
    duration: "42 mins",
    date: "Oct 24, 2026",
    icon: "business_center",
    iconColor: "text-primary",
    accuracy: "98.4%",
    latency: "142ms",
    wordCount: "4,821",
  },
  {
    id: "2",
    name: "Travel Inquiry: Tokyo",
    fromLang: "ENG",
    toLang: "JPN",
    pairingType: "arrow",
    duration: "15 mins",
    date: "Oct 23, 2026",
    icon: "star",
    iconColor: "text-tertiary", 
    accuracy: "99.1%",
    latency: "120ms",
    wordCount: "1,240",
    isStarred: true,
  },
  {
    id: "3",
    name: "Design Workshop",
    fromLang: "FRA",
    toLang: "ENG",
    pairingType: "arrow",
    duration: "1h 10m",
    date: "Oct 21, 2026",
    icon: "draw",
    iconColor: "text-primary",
    accuracy: "97.8%",
    latency: "165ms",
    wordCount: "12,410",
  },
  {
    id: "4",
    name: "Casual Conversation",
    fromLang: "SPA",
    toLang: "ENG",
    pairingType: "swap",
    duration: "28 mins",
    date: "Oct 20, 2026",
    icon: "chat",
    iconColor: "text-primary",
    accuracy: "99.5%",
    latency: "138ms",
    wordCount: "3,110",
  },
];

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filterType, setFilterType] = useState<"all" | "starred">("all");

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || session.isStarred;
    return matchesSearch && matchesFilter;
  });

  const handleRowClick = (session: Session) => {
    setSelectedSession(session);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-[#e7e0ed] relative font-sans">
      {/* Interactive WebGL Backdrop */}
      <ShaderBackground />

      <Header />
      
      {/* Sidebar Navigation + Main area */}
      <div className="flex flex-1 pt-[120px] relative z-10">
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 px-6 md:px-12 py-8 max-w-[1200px] mx-auto w-full pb-20 md:pb-12 bg-transparent overflow-y-auto">
          <div className="relative z-10">
            
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-[32px] font-semibold text-white tracking-tight font-geist mb-1">
                  Conversation Logs
                </h1>
                <p className="text-sm text-[#cbc3d7]/70 max-w-2xl leading-relaxed font-light">
                  Linguistic analysis and deep transcripts from your neural translation sessions. Powered by Voxa AI.
                </p>
              </div>
              <div className="flex items-center gap-2 select-none">
                <button className="px-4 py-2 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] text-[#cbc3d7] hover:text-white text-xs transition-all font-bold">
                  Cloud Sync
                </button>
                <button className="px-4 py-2 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] text-[#cbc3d7] hover:text-white text-xs transition-all font-bold">
                  Export logs
                </button>
              </div>
            </header>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
              <div className="relative flex-1 w-full font-sans">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[20px] select-none">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0a]/80 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/20 text-white text-sm placeholder:text-zinc-500 font-mono"
                  placeholder="Search historical logs..."
                  type="text"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto no-scrollbar shrink-0 select-none">
                <button
                  onClick={() => setFilterType("all")}
                  className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs transition-all font-bold ${
                    filterType === "all"
                      ? "border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#d0bcff]"
                      : "border-white/5 bg-[#0a0a0a] text-zinc-400 hover:text-white"
                  }`}
                >
                  All Sessions
                </button>
                <button
                  onClick={() => setFilterType("starred")}
                  className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs transition-all font-bold ${
                    filterType === "starred"
                      ? "border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#d0bcff]"
                      : "border-white/5 bg-[#0a0a0a] text-zinc-400 hover:text-white"
                  }`}
                >
                  Starred
                </button>
                <button className="whitespace-nowrap px-4 py-2 rounded-full border border-white/5 bg-[#0a0a0a] text-zinc-400 hover:text-white text-xs flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px]">tune</span> Filter
                </button>
              </div>
            </div>

            {/* Dense Table View */}
            <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden mb-12 shadow-2xl">
              <div className="grid grid-cols-12 px-6 py-4 bg-[#0f0d15]/50 border-b border-white/5 text-[10px] uppercase tracking-widest font-mono font-bold text-[#cbc3d7]/50 select-none">
                <div className="col-span-5 lg:col-span-4">Conversation Name</div>
                <div className="col-span-4 lg:col-span-3">Language Pairing</div>
                <div className="hidden lg:block col-span-2 text-center">Duration</div>
                <div className="col-span-3 text-right">Date</div>
              </div>
              <div className="divide-y divide-white/5">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleRowClick(session)}
                      className={`grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-all ${
                        selectedSession?.id === session.id
                          ? "bg-white/[0.03] border-l-2 border-[#8b5cf6]"
                          : "hover:bg-white/[0.01]"
                      }`}
                    >
                      <div className="col-span-5 lg:col-span-4 flex items-center gap-3">
                        <span className={`material-symbols-outlined text-[18px] ${
                          session.id === "2" ? "text-[#ffb869]" : "text-[#d0bcff]"
                        }`}>
                          {session.icon}
                        </span>
                        <span className="text-[#e7e0ed] font-semibold text-sm truncate font-geist">
                          {session.name}
                        </span>
                      </div>
                      <div className="col-span-4 lg:col-span-3 flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/5 bg-white/5 text-[#cbc3d7] uppercase font-mono">
                          {session.fromLang}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-zinc-600 select-none">
                          {session.pairingType === "arrow" ? "arrow_forward" : "swap_horiz"}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-mono ${
                            session.toLang === "MAN"
                              ? "border-[#ffb869]/20 bg-[#ffb869]/5 text-[#ffb869]"
                              : session.toLang === "JPN"
                              ? "border-[#adc6ff]/20 bg-[#adc6ff]/5 text-[#adc6ff]"
                              : "border-white/5 bg-white/5 text-[#cbc3d7]"
                          }`}
                        >
                          {session.toLang}
                        </span>
                      </div>
                      <div className="hidden lg:block col-span-2 text-center text-xs text-zinc-400 font-light">
                        {session.duration}
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="text-xs text-zinc-500 font-mono">{session.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center text-[#ffb4ab] font-mono text-xs">
                    NO_SESSIONS_FOUND_MATCHING_CRITERIA
                  </div>
                )}
              </div>
            </div>

            {/* Details Panel Section below (dynamically rendered) */}
            <div
              className={`bg-[#0a0a0a]/90 backdrop-blur-md border border-white/5 rounded-xl p-6 transition-all duration-300 transform ${
                selectedSession
                  ? "opacity-100 translate-y-0 block"
                  : "opacity-0 translate-y-4 hidden"
              }`}
            >
              {selectedSession && (
                <>
                  <div className="flex justify-between items-center mb-6 select-none">
                    <h2 className="text-lg font-bold text-white font-geist flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#8b5cf6]">analytics</span>
                      Session Summary: {selectedSession.name}
                    </h2>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/5 text-[#cbc3d7] hover:text-[#8b5cf6] transition-colors" title="Share log">
                        <span className="material-symbols-outlined text-[18px]">share</span>
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-[#cbc3d7] hover:text-[#8b5cf6] transition-colors" title="Download text transcript">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-y border-white/5 py-6 font-sans">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#8b5cf6] text-[20px]">translate</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-mono">Accuracy</p>
                        <p className="text-lg font-bold text-white">{selectedSession.accuracy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#ffb869] text-[20px]">speed</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-mono">Latency</p>
                        <p className="text-lg font-bold text-white">{selectedSession.latency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">description</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-mono">Word Count</p>
                        <p className="text-lg font-bold text-white">{selectedSession.wordCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#d0bcff] hover:bg-[#8b5cf6]/25 px-8 py-3 rounded-lg font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest font-mono active:scale-98">
                      View Full Neural Transcript
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-12 bg-black border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 mt-auto select-none">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-lg font-bold text-white font-headline-md">Voxa</span>
          <p className="text-[11px] text-zinc-500 font-medium tracking-wide">© 2026 Voxa AI. Neural Translation Engine.</p>
        </div>
        <div className="flex gap-6 font-mono text-[10px]">
          <Link className="text-zinc-500 hover:text-[#d0bcff] transition-colors" href="#">PRIVACY_POLICY</Link>
          <Link className="text-zinc-500 hover:text-[#d0bcff] transition-colors" href="#">TERMS_OF_SERVICE</Link>
          <Link className="text-zinc-500 hover:text-[#d0bcff] transition-colors" href="#">SUPPORT</Link>
        </div>
      </footer>

      {/* Mobile bottom navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-16 z-50">
        <Link href="/workspace" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-medium font-sans">Workspace</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-[#8b5cf6] flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            history
          </span>
          <span className="text-[10px] font-medium font-sans">History</span>
        </Link>
        <Link href="/technology" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
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
