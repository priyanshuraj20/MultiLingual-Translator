// app/workspace/page.tsx
"use client";

import React, { useRef, useState } from "react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState(false);

  // ✅ FIXED: Match backend response keys
  const [transcript, setTranscript] = useState("");
  const [outputText, setOutputText] = useState(
    "Welcome to the applied technology conference. Today we will explore the future of neural translation.",
  );
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ========== RECORDING ==========
  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        await uploadAudio(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      setError("Microphone access denied");
      console.error(error);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.stop();
    recorder.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  // ========== UPLOAD & PROCESS AUDIO ==========
  const uploadAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");

      console.log("📤 Uploading audio...");

      const response = await fetch(
        "http://localhost:8000/speech/translate-and-speak",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Response received:", data);

      // ✅ FIXED: Use correct keys
      if (data.success) {
        setTranscript(data.transcript || "");
        setOutputText(data.translated_text || "");
        setTtsAudioUrl(data.output_audio_url || null);
      } else {
        setError("Processing failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setOutputText("Error: Could not retrieve translation from server.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ========== PLAY TTS AUDIO ==========
  const playTTSAudio = () => {
    if (!ttsAudioUrl) {
      setError("No audio to play");
      return;
    }

    try {
      const audio = new Audio(ttsAudioUrl);
      setIsPlayingTTS(true);
      audio.onended = () => setIsPlayingTTS(false);
      audio.play().catch((e) => {
        setError(`Playback failed: ${e.message}`);
      });
    } catch (error) {
      setError("Failed to play audio");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
      <Header />
      <div className="flex flex-1 pt-14 overflow-hidden relative">
        <Sidebar />

        {/* Workspace Main Area */}
        <div className="flex-1 flex flex-col relative bg-background overflow-hidden">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-6 py-3 flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-300 hover:text-red-200"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Grid Panels */}
          <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden pb-16 md:pb-6">
            {/* Input Panel */}
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
                          ? "bg-primary animate-pulse"
                          : isProcessing
                            ? "bg-yellow-500 animate-pulse"
                            : "bg-zinc-600"
                      }`}
                    ></span>
                  </div>
                  <div className="font-mono text-[10px] text-primary uppercase">
                    {isRecording
                      ? "Recording..."
                      : isProcessing
                        ? "Processing..."
                        : "Standby"}
                  </div>
                </div>

                {/* Stream Transcript */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {transcript ? (
                    <div className="border-l border-primary/30 pl-4 py-2">
                      <p className="font-mono text-[10px] text-primary/60 mb-1">
                        transcription | language: en-US
                      </p>
                      <p className="text-base text-zinc-100 leading-relaxed">
                        {transcript}
                      </p>
                    </div>
                  ) : (
                    <div className="border-l border-white/5 pl-4 py-2">
                      <p className="text-base text-zinc-500 italic">
                        {isRecording
                          ? "🎤 Listening..."
                          : isProcessing
                            ? "⏳ Processing audio..."
                            : "Start speaking..."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Waveform Visualization */}
                <div className="h-20 bg-black/30 border-t border-[#ffffff1a] flex items-center justify-center gap-1.5 px-4">
                  {waveformBars.map((bar, i) => (
                    <div
                      key={i}
                      style={{
                        height: isRecording ? bar.height : "8px",
                        animationDelay: bar.delay,
                      }}
                      className={`w-1 rounded-full transition-all ${
                        isRecording
                          ? "bg-primary/70 animate-[pulse_0.8s_ease-in-out_infinite]"
                          : "bg-zinc-700/50"
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Recording Controls */}
                <div className="p-4 border-t border-[#ffffff1a] bg-black/30 flex gap-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`group p-4 border rounded-full transition-all ${
                      isRecording
                        ? "border-primary/45 bg-primary/10 hover:bg-primary/20 text-primary"
                        : "border-white/10 hover:border-white/20 text-zinc-500 bg-transparent disabled:opacity-50"
                    }`}
                  >
                    <span className="text-2xl font-light">
                      {isRecording ? "🎙️" : "🎤"}
                    </span>
                  </button>

                  {/* Audio Playback */}
                  {audioUrl && (
                    <audio
                      ref={audioPlayerRef}
                      src={audioUrl}
                      controls
                      className="flex-1 h-12 rounded bg-black/50"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-6 h-full overflow-hidden">
              <div className="flex-1 flex flex-col border border-[#ffffff1a] bg-[#111111] overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-[#ffffff1a] bg-black/50 select-none">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-tighter text-zinc-400">
                      [02] Output_Buffer (Hindi)
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleCopy}
                      className="hover:text-primary transition-colors text-zinc-400 focus:outline-none flex items-center gap-1"
                    >
                      <span className="text-base">{copied ? "✓" : "📋"}</span>
                      {copied && (
                        <span className="text-[10px] font-mono text-primary">
                          Copied
                        </span>
                      )}
                    </button>
                    <button className="hover:text-primary transition-colors text-zinc-400">
                      💾
                    </button>
                  </div>
                </div>

                {/* Output Transcript */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  <div className="bg-white/5 p-4 border border-white/10">
                    <p className="font-mono text-[10px] text-zinc-400 mb-2">
                      TARGET: HI-IN (NLLB-200-DISTILLED)
                    </p>
                    <p className="text-base text-zinc-100 leading-relaxed">
                      {outputText}
                    </p>
                  </div>
                </div>

                {/* TTS Audio Player */}
                {ttsAudioUrl && (
                  <div className="p-4 border-t border-[#ffffff1a] bg-black/30">
                    <p className="font-mono text-[10px] text-zinc-400 mb-3">
                      🔊 GENERATED SPEECH (Hindi)
                    </p>
                    <audio
                      src={ttsAudioUrl}
                      controls
                      className="w-full h-10 rounded"
                      onPlay={() => setIsPlayingTTS(true)}
                      onPause={() => setIsPlayingTTS(false)}
                    />
                  </div>
                )}

                {/* Confidence Meter */}
                <div className="p-4 border-t border-[#ffffff1a] bg-black/30 select-none">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] uppercase text-zinc-400">
                      Inference_Confidence
                    </span>
                    <span className="font-mono text-[10px] text-primary">
                      95.00%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-none overflow-hidden">
                    <div className="h-full bg-primary w-[95%] transition-all duration-500"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => {
                    setOutputText("");
                    setTranscript("");
                    setTtsAudioUrl(null);
                  }}
                  className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-[#ffffff1a] hover:border-white transition-colors disabled:opacity-50"
                  disabled={isProcessing}
                >
                  Clear_Cache
                </button>
                <button
                  onClick={playTTSAudio}
                  disabled={!ttsAudioUrl || isPlayingTTS}
                  className="font-mono text-[10px] uppercase tracking-widest px-6 py-2 bg-primary text-black font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlayingTTS ? "Playing..." : "🔊 Play_TTS"}
                </button>
              </div>
            </div>
          </div>

          {/* Status Footer */}
          <footer className="h-10 bg-black border-t border-[#ffffff1a] w-full flex items-center px-6 justify-between select-none absolute bottom-0 md:relative shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-2 py-0.5 border border-[#ffffff1a] rounded bg-zinc-900/50">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">
                  Source
                </span>
                <span className="font-mono text-[10px] text-white">EN-US</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-0.5 border border-[#ffffff1a] rounded bg-zinc-900/50">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">
                  Target
                </span>
                <span className="font-mono text-[10px] text-white">HI-IN</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-2 py-0.5 border border-[#ffffff1a] rounded bg-zinc-900/50">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">
                  Engine
                </span>
                <span className="font-mono text-[10px] text-white">
                  WHISPER + NLLB
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-mono text-[10px] text-zinc-400 uppercase">
                  System_Ready
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#111111] border-t border-white/10 flex justify-around items-center h-14 z-50">
        <Link
          href="/workspace"
          className="flex flex-col items-center gap-0.5 text-primary"
        >
          <span>🎤</span>
          <span className="text-[10px] font-medium">Workspace</span>
        </Link>
        <Link
          href="/history"
          className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white"
        >
          <span>📋</span>
          <span className="text-[10px] font-medium">History</span>
        </Link>
        <Link
          href="/technology"
          className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white"
        >
          <span>🧠</span>
          <span className="text-[10px] font-medium">Tech</span>
        </Link>
      </div>
    </div>
  );
}
