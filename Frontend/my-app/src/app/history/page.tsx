"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

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
    date: "Oct 24, 2023",
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
    date: "Oct 23, 2023",
    icon: "star",
    iconColor: "text-[#ffb59a]", // Tertiary color in Precision Dark
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
    date: "Oct 21, 2023",
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
    date: "Oct 20, 2023",
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
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Header />
      <div className="flex flex-1 pt-14">
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 px-6 md:px-12 py-8 max-w-[1280px] mx-auto relative w-full pb-20 md:pb-12">
          <div className="relative z-10">
            
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">
                  Conversation History
                </h1>
                <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                  Linguistic analysis and professional transcripts from your neural translation sessions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded border border-white/10 text-zinc-400 hover:text-white text-xs transition-all hover:bg-white/5 font-medium">
                  Cloud Sync
                </button>
                <button className="px-3 py-1.5 rounded border border-white/10 text-zinc-400 hover:text-white text-xs transition-all hover:bg-white/5 font-medium">
                  Export All
                </button>
              </div>
            </header>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[20px] select-none">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 text-white text-sm placeholder:text-zinc-500"
                  placeholder="Search sessions..."
                  type="text"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto no-scrollbar shrink-0">
                <button
                  onClick={() => setFilterType("all")}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-xs transition-all ${
                    filterType === "all"
                      ? "border-primary/45 bg-primary/10 text-primary"
                      : "border-white/10 text-zinc-400 hover:bg-white/5"
                  }`}
                >
                  All Sessions
                </button>
                <button
                  onClick={() => setFilterType("starred")}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-xs transition-all ${
                    filterType === "starred"
                      ? "border-primary/45 bg-primary/10 text-primary"
                      : "border-white/10 text-zinc-400 hover:bg-white/5"
                  }`}
                >
                  Starred
                </button>
                <button className="whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:bg-white/5 text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">tune</span> Filter
                </button>
              </div>
            </div>

            {/* Dense Table View */}
            <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden mb-12 shadow-md">
              <div className="grid grid-cols-12 px-6 py-3 bg-zinc-900 border-b border-white/10 text-[11px] uppercase tracking-wider font-bold text-zinc-400 select-none">
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
                      className={`grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors ${
                        selectedSession?.id === session.id
                          ? "bg-white/[0.04] border-l-2 border-primary"
                          : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="col-span-5 lg:col-span-4 flex items-center gap-3">
                        <span className={`material-symbols-outlined text-[18px] ${session.iconColor}`}>
                          {session.icon}
                        </span>
                        <span className="text-zinc-100 font-semibold text-sm truncate">
                          {session.name}
                        </span>
                      </div>
                      <div className="col-span-4 lg:col-span-3 flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-400 uppercase font-mono">
                          {session.fromLang}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-zinc-600 select-none">
                          {session.pairingType === "arrow" ? "arrow_forward" : "swap_horiz"}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-mono ${
                            session.toLang === "MAN"
                              ? "border-tertiary/20 bg-tertiary/5 text-tertiary"
                              : session.toLang === "JPN"
                              ? "border-secondary/20 bg-secondary/5 text-zinc-300"
                              : "border-white/10 bg-white/5 text-zinc-400"
                          }`}
                        >
                          {session.toLang}
                        </span>
                      </div>
                      <div className="hidden lg:block col-span-2 text-center text-xs text-zinc-400">
                        {session.duration}
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="text-xs text-zinc-400 font-mono">{session.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center text-zinc-500 font-mono text-xs">
                    NO_SESSIONS_FOUND_MATCHING_CRITERIA
                  </div>
                )}
              </div>
            </div>

            {/* Details Panel Section below (dynamically rendered) */}
            <div
              className={`bg-zinc-950 border border-white/5 rounded-xl p-6 transition-all duration-300 transform ${
                selectedSession
                  ? "opacity-100 translate-y-0 block"
                  : "opacity-0 translate-y-4 hidden"
              }`}
            >
              {selectedSession && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-zinc-100">
                      Session Details: {selectedSession.name}
                    </h2>
                    <div className="flex gap-2">
                      <button className="p-2 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors" title="Share">
                        <span className="material-symbols-outlined text-[18px]">share</span>
                      </button>
                      <button className="p-2 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors" title="Download">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-y border-white/5 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[20px]">translate</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Accuracy</p>
                        <p className="text-lg font-bold text-white">{selectedSession.accuracy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">speed</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Latency</p>
                        <p className="text-lg font-bold text-white">{selectedSession.latency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-zinc-400 text-[20px]">description</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Word Count</p>
                        <p className="text-lg font-bold text-white">{selectedSession.wordCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="bg-primary/10 border border-primary/20 text-primary px-8 py-2 rounded font-bold text-xs hover:bg-primary/20 transition-all flex items-center gap-2 uppercase tracking-wider font-mono">
                      View Full Neural Transcript
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-12 bg-black border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 mt-auto">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-lg font-bold text-primary tracking-tight">LiveLingua</span>
          <p className="text-[12px] text-zinc-500 font-medium tracking-wide">© 2026 LiveLingua AI. Neural Translation Engine.</p>
        </div>
        <div className="flex gap-6">
          <Link className="text-[12px] text-zinc-500 hover:text-primary transition-colors" href="#">Privacy</Link>
          <Link className="text-[12px] text-zinc-500 hover:text-primary transition-colors" href="#">Terms</Link>
          <Link className="text-[12px] text-zinc-500 hover:text-primary transition-colors" href="#">API</Link>
          <Link className="text-[12px] text-zinc-500 hover:text-primary transition-colors" href="#">Support</Link>
        </div>
      </footer>

      {/* Mobile navigation bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#111111] border-t border-white/10 flex justify-around items-center h-14 z-50">
        <Link href="/workspace" className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white">
          <span className="material-symbols-outlined text-[20px]">mic</span>
          <span className="text-[10px] font-medium">Workspace</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-0.5 text-primary">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            history
          </span>
          <span className="text-[10px] font-medium">History</span>
        </Link>
        <Link href="/technology" className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white">
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
