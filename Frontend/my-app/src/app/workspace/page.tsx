"use client";

import React, { useRef, useState } from "react";

// useRef used beacuse mediaRecoder changes internally no ui update needed    If we use useState, React will unnecessarily re-render.
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

const waveformBars = [
  { delay: "0.1s", height: "30%" },
  { delay: "0.3s", height: "60%" },
  { delay: "0.2s", height: "45%" },
  { delay: "0.5s", height: "80%" },
  { delay: "0.4s", height: "40%" },
  { delay: "0.6s", height: "95%" },
  { delay: "0.3s", height: "50%" },
  { delay: "0.7s", height: "35%" },
  { delay: "0.2s", height: "75%" },
  { delay: "0.4s", height: "20%" },
  { delay: "0.1s", height: "55%" },
];

export default function WorkspacePage() {
  const [isRecording, setIsRecording] = useState(false);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);
  const [copied, setCopied] = useState(false);
  const [outputText, setOutputText] = useState(
    "Welcome to the applied technology conference. Today we will explore the future of neural translation.",
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const startRecording = async () => {
    // 🎤 Allow Microphone?
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    // Store references
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    // 1. Tell the recorder what to do ONCE it stops tracking sound wave frequencies
    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      console.log("Blob Ready", blob);

      // 2. Trigger the parcel upload delivery task immediately
      await uploadAudio(blob);
    };

    // 3. Actually trigger the physical hardware shutoff action
    recorder.stop(); // recorder stops but microphone is still ON , Window will still show the microphone being used  so:
    recorder.stream.getTracks().forEach((track) => track.stop()); //These releases the microphone hardware.
    setIsRecording(false);
  };

  // 4. Isolated asynchronous network parcel sender
  const uploadAudio = async (blob: Blob) => {
    try {
      const formData = new FormData();
      // Names must match your FastAPI argument parameter name exactly!
      formData.append("file", blob, "recording.webm");

      const response = await fetch("http://127.0.0.1:8000/speech/transcribe", {
        method: "POST",
        body: formData, // Browser automatically injects multipart boundaries here!
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("UPLOAD SUCCESSFULLY ", data);
      alert("Audio Uploaded Successfully!");
    } catch (error) {
      console.error("Failed to upload audio binary:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
      <Header />
      <div className="flex flex-1 pt-14 overflow-hidden relative">
        <Sidebar />

        {/* Workspace Main Area */}
        <div className="flex-1 flex flex-col relative bg-background overflow-hidden">
          {/* Main Grid Panels */}
          <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden pb-16 md:pb-6">
            {/* Input Panel (Spanish) */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-6 h-full overflow-hidden">
              <div className="flex-1 flex flex-col border border-[#ffffff1a] bg-[#111111] overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-[#ffffff1a] bg-black/50 select-none">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-tighter text-zinc-400">
                      [01] Input_Stream
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isRecording
                          ? "bg-primary animate-pulse-recording"
                          : "bg-zinc-600"
                      }`}
                    ></span>
                  </div>
                  <div className="font-mono text-[10px] text-primary uppercase">
                    Recording_State: {isRecording ? "Active" : "Standby"}
                  </div>
                </div>

                {/* Stream Transcript */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  <div className="border-l border-primary/30 pl-4 py-2">
                    <p className="font-mono text-[10px] text-primary/60 mb-1">
                      timestamp: 14:22:01 | speaker: 01
                    </p>
                    <p className="text-base text-zinc-100 leading-relaxed">
                      Bienvenidos a la conferencia de tecnología aplicada. Hoy
                      exploraremos el futuro de la traducción neural.
                    </p>
                  </div>
                  {isRecording && (
                    <div className="border-l border-white/5 pl-4 py-2">
                      <p className="font-mono text-[10px] text-zinc-600 mb-1">
                        timestamp: 14:22:05 | speaker: 02
                      </p>
                      <p className="text-base text-zinc-500 italic">
                        Buffer streaming active...
                      </p>
                    </div>
                  )}
                </div>

                {/* Waveform Visualization area */}
                <div className="h-20 bg-black/30 border-t border-[#ffffff1a] flex items-center justify-center gap-1.5 px-4">
                  {waveformBars.map((bar, i) => (
                    <div
                      key={i}
                      style={{
                        height: isRecording ? bar.height : "8px",
                        animationDelay: bar.delay,
                        animationPlayState: isRecording ? "running" : "paused",
                      }}
                      className={
                        isRecording
                          ? "w-1 bg-primary rounded-full animate-waveform-jump"
                          : "w-1 bg-zinc-700 rounded-full"
                      }
                    ></div>
                  ))}
                </div>
              </div>

              {/* Mic Action Control */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <button
                  onClick={() => {
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording();
                    }
                  }}
                  className={`group p-4 border rounded-full transition-all ${
                    isRecording
                      ? "border-primary/45 bg-primary/10 hover:bg-primary/20 text-primary"
                      : "border-white/10 hover:border-white/20 text-zinc-500 bg-transparent"
                  }`}
                  title={isRecording ? "Mute Microphone" : "Unmute Microphone"}
                >
                  <span className="material-symbols-outlined text-3xl font-light">
                    {isRecording ? "mic" : "mic_off"}
                  </span>
                </button>
                {audioUrl && <audio controls src={audioUrl} className="mt-4" />}
              </div>
            </div>

            {/* Output Panel (English) */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-6 h-full overflow-hidden">
              <div className="flex-1 flex flex-col border border-[#ffffff1a] bg-[#111111] overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-[#ffffff1a] bg-black/50 select-none">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-tighter text-zinc-400">
                      [02] Output_Buffer
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleCopy}
                      className="hover:text-primary transition-colors text-zinc-400 focus:outline-none flex items-center gap-1"
                      title="Copy Output"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {copied ? "check" : "content_copy"}
                      </span>
                      {copied && (
                        <span className="text-[10px] font-mono text-primary">
                          Copied
                        </span>
                      )}
                    </button>
                    <button
                      className="hover:text-primary transition-colors text-zinc-400"
                      title="Save Output"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        save
                      </span>
                    </button>
                  </div>
                </div>

                {/* Output Transcript */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  <div className="bg-white/5 p-4 border border-white/10">
                    <p className="font-mono text-[10px] text-zinc-400 mb-2">
                      TARGET_LANG: EN-US (TRANSFORMER_V4)
                    </p>
                    <p className="text-base text-zinc-100 leading-relaxed">
                      {outputText}
                    </p>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div className="p-4 border-t border-[#ffffff1a] bg-black/30 select-none">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] uppercase text-zinc-400">
                      Inference_Confidence
                    </span>
                    <span className="font-mono text-[10px] text-primary">
                      98.42%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-none overflow-hidden">
                    <div className="h-full bg-primary w-[98.42%] transition-all duration-500"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => setOutputText("")}
                  className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-[#ffffff1a] hover:border-white transition-colors"
                >
                  Clear_Cache
                </button>
                <button className="font-mono text-[10px] uppercase tracking-widest px-6 py-2 bg-white text-black font-bold hover:bg-zinc-200 transition-colors">
                  Execute_TTS
                </button>
              </div>
            </div>
          </div>

          {/* Nominal Status Footer */}
          <footer className="h-10 bg-black border-t border-[#ffffff1a] w-full flex items-center px-6 justify-between select-none absolute bottom-0 md:relative shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-2 py-0.5 border border-[#ffffff1a] rounded bg-zinc-900/50">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">
                  Lang
                </span>
                <span className="font-mono text-[10px] text-white">
                  ES-LATAM
                </span>
              </div>
              <div className="flex items-center gap-2 px-2 py-0.5 border border-[#ffffff1a] rounded bg-zinc-900/50">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">
                  Latency
                </span>
                <span className="font-mono text-[10px] text-primary">
                  120ms
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-2 py-0.5 border border-[#ffffff1a] rounded bg-zinc-900/50">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">
                  Engine
                </span>
                <span className="font-mono text-[10px] text-white">
                  WHISPER_V3_L
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-mono text-[10px] text-zinc-400 uppercase">
                  System_Nominal
                </span>
              </div>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="w-6 h-6 rounded-sm bg-primary/20 border border-primary/40 flex items-center justify-center">
                <span className="font-mono text-[8px] font-bold text-primary select-none">
                  AI
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile navigation bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#111111] border-t border-white/10 flex justify-around items-center h-14 z-50">
        <Link
          href="/workspace"
          className="flex flex-col items-center gap-0.5 text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">mic</span>
          <span className="text-[10px] font-medium">Workspace</span>
        </Link>
        <Link
          href="/history"
          className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            history
          </span>
          <span className="text-[10px] font-medium">History</span>
        </Link>
        <Link
          href="/technology"
          className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white"
        >
          <span className="material-symbols-outlined text-[20px]">
            neurology
          </span>
          <span className="text-[10px] font-medium">Tech</span>
        </Link>
        <Link
          href="/design-system"
          className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white"
        >
          <span className="material-symbols-outlined text-[20px]">palette</span>
          <span className="text-[10px] font-medium">Design</span>
        </Link>
      </div>
    </div>
  );
}
