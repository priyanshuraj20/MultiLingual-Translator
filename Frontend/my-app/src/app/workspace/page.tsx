// app/workspace/page.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import ShaderBackground from "@/components/ui/ShaderBackground";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import CustomAudioPlayer from "@/components/ui/CustomAudioPlayer";

// List of wave bars delays and heights to create a natural, organic audio wave visualization
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
  // ==========================================
  // React State variables
  // ==========================================
  const [isRecording, setIsRecording] = useState(false);       // Tracks if microphone is actively capturing voice
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Stores raw audio data block in webm format
  const [audioUrl, setAudioUrl] = useState<string | null>(null);   // URL representation of the recorded audio for local playing
  const [isProcessing, setIsProcessing] = useState(false);     // Tracks if upload translation fetch is pending
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);     // Tracks if synthesized translation voice is playing
  const [copied, setCopied] = useState(false);                 // Visual feedback state when copying translation output
  const [error, setError] = useState("");                       // Error alert state

  // Translation metrics from FastAPI backend
  const [transcript, setTranscript] = useState("");            // Real-time transcribed text of the spoken English input
  const [outputText, setOutputText] = useState(
    "Welcome to the applied technology conference. Today we will explore the future of neural translation."
  );                                                            // Target translated text (Hindi) returned from the server
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null); // URL path to access synthesized TTS speech on the server

  // ==========================================
  // References for non-reactive items
  // ==========================================
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);  // Ref to hold standard browser MediaRecorder instance
  const audioChunksRef = useRef<Blob[]>([]);                    // Array to aggregate raw chunks of recorded audio stream
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);  // Ref to play back recorded local audio file

  // ==========================================
  // Clipboard copying helper
  // ==========================================
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ==========================================
  // AUDIO RECORDING FUNCTIONS
  // ==========================================
  
  // Initiates microphone capture stream and creates the MediaRecorder instance
  const startRecording = async () => {
    setError("");
    try {
      // Prompt user for mic permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      // Event handler called continuously as microphone data chunks become available
      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // Callback triggered when recording is stopped, consolidating chunks and posting payload to server
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Auto upload recorded blob for processing
        await uploadAudio(blob);
      };

      // Start capture
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied. Please inspect settings.");
      console.error("Recording start error:", err);
    }
  };

  // Stops recording and releases microphone resources
  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.stop();
    // Stop all media tracks associated with the stream to release the microphone lock
    recorder.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  // ==========================================
  // BACKEND API TRANSLATION STREAM
  // ==========================================
  
  // Uploads raw WebM audio blob to the translation engine endpoint
  const uploadAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setError("");

    try {
      // Assemble standard multi-part form data
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");

      console.log("📤 Sending speech translation request...");

      // FastAPI Speech-to-Speech Endpoint
      const response = await fetch("http://localhost:8000/speech/translate-and-speak", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP network error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Translation result from API:", data);

      // Verify the response contains expected success tokens
      if (data.success) {
        setTranscript(data.transcript || "");
        setOutputText(data.translated_text || "");
        setTtsAudioUrl(data.output_audio_url || null);
      } else {
        setError("Speech translation server failed to process request.");
      }
    } catch (err) {
      console.error("Audio processing failure:", err);
      setError(
        `Translation service error: ${err instanceof Error ? err.message : "Internal system down"}`
      );
      setOutputText("Error: Could not retrieve translation from server.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================
  // TEXT-TO-SPEECH (TTS) PLAYBACK CONTROL
  // ==========================================
  
  // Initiates browser playback for the synthesized translation audio file from server URL
  const playTTSAudio = () => {
    if (!ttsAudioUrl) {
      setError("No target audio found. Record speech to generate speech.");
      return;
    }

    try {
      const audio = new Audio(ttsAudioUrl);
      setIsPlayingTTS(true);
      
      // Reset play status when track ends
      audio.onended = () => setIsPlayingTTS(false);
      audio.onerror = () => {
        setError("Failed to stream TTS output file.");
        setIsPlayingTTS(false);
      };

      audio.play().catch((e) => {
        setError(`Audio play failed: ${e.message}`);
        setIsPlayingTTS(false);
      });
    } catch (err) {
      setError("Playback system initialization failed.");
      setIsPlayingTTS(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-[#e7e0ed] relative font-sans">
      {/* Interactive shader flow background */}
      <ShaderBackground />

      <Header />
      
      {/* Sidebar navigation + Main Area wrapper. 
          Adjusted pt-[120px] dynamically offset top fixed banner + header height */}
      <div className="flex flex-1 pt-[120px] overflow-hidden relative z-10">
        <Sidebar />

        {/* Workspace core container */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
          
          {/* Error alert wrapper */}
          {error && (
            <div className="mx-6 mt-6 bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffdad6] px-6 py-3 rounded-lg flex items-center justify-between z-20 backdrop-blur-md">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </span>
              <button
                onClick={() => setError("")}
                className="text-[#ffdad6] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Grid Split-view Workspace */}
          <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden pb-20 md:pb-6">
            
            {/* LEFT COLUMN: Input Stream Context (Whisper ASR) */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex-1 flex flex-col premium-card overflow-hidden">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40 select-none">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#cbc3d7]/60">
                      [01] Input_Stream
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isRecording
                          ? "bg-[#8b5cf6] animate-pulse"
                          : isProcessing
                          ? "bg-[#ffb869] animate-pulse"
                          : "bg-white/20"
                      }`}
                    ></span>
                  </div>
                  <div className="font-mono text-[9px] text-[#d0bcff] uppercase tracking-widest font-bold">
                    {isRecording
                      ? "Recording..."
                      : isProcessing
                      ? "Processing..."
                      : "Standby"}
                  </div>
                </div>

                {/* Speech transcript text display */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {isProcessing && !transcript ? (
                    <div className="border-l-2 border-[#8b5cf6]/40 pl-6 py-3 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-ping" />
                        <p className="font-mono text-[9px] text-[#d0bcff] uppercase tracking-widest font-bold">
                          [VOXA CORE] Parsing speech tokens...
                        </p>
                      </div>
                      <div className="font-mono text-[11px] text-zinc-500 space-y-1.5 pl-1 leading-relaxed">
                        <div>&gt; Initializing Whisper large-v3 decoder...</div>
                        <div>&gt; Slicing acoustic spectrogram blocks...</div>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <span className="w-1.5 h-3 bg-[#8b5cf6] animate-pulse" />
                          <span>Computing self-attention query weights...</span>
                        </div>
                      </div>
                      <SkeletonLoader lines={2} />
                    </div>
                  ) : transcript ? (
                    <div className="border-l-2 border-[#8b5cf6]/40 pl-6 py-2">
                      <p className="font-mono text-[10px] text-[#d0bcff]/60 mb-2 uppercase tracking-widest">
                        Transcribed speech (EN-US)
                      </p>
                      <p className="text-lg text-white font-light leading-relaxed">
                        {transcript}
                        {/* Blinking prompt cursor from Stitch mockup */}
                        <span 
                          id="streaming-cursor"
                          className="inline-block w-1.5 h-5 bg-[#8b5cf6]/80 ml-2 align-middle animate-streaming-cursor shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                        />
                      </p>
                    </div>
                  ) : (
                    <div className="border-l-2 border-white/5 pl-6 py-2">
                      <p className="text-lg text-[#cbc3d7]/40 italic font-light">
                        {isRecording
                          ? "🎤 Capturing acoustic signals... speak clearly."
                          : "Simulating translation on a web page. Press the microphone button below to start."}
                        {!isRecording && (
                          <span 
                            id="streaming-cursor"
                            className="inline-block w-1.5 h-5 bg-white/40 ml-2 align-middle animate-streaming-cursor"
                          />
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Local wave indicator when capturing speech */}
                <div className="h-16 bg-black/40 border-t border-white/5 flex items-center justify-center gap-1.5 px-4 select-none">
                  {waveformBars.map((bar, i) => (
                    <div
                      key={i}
                      style={{
                        height: isRecording ? bar.height : "4px",
                        animationDelay: bar.delay,
                      }}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isRecording
                          ? "bg-[#8b5cf6] animate-waveform-jump"
                          : "bg-white/10"
                      }`}
                    ></div>
                  ))}
                                 {/* Local audio record trigger and player */}
                <div className="p-4 border-t border-white/5 bg-black/40 flex items-center gap-4 select-none">
                  {/* Radar pulsing ring active micro state */}
                  <div className="relative shrink-0">
                    {isRecording && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-[#8b5cf6]/30 animate-ping scale-150" />
                        <span className="absolute -inset-1.5 rounded-full border border-[#8b5cf6]/30 animate-pulse scale-110" />
                      </>
                    )}
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`group w-14 h-14 flex items-center justify-center rounded-full border transition-all duration-300 relative z-10 ${
                        isRecording
                          ? "border-[#8b5cf6]/40 bg-[#8b5cf6]/20 text-[#d0bcff] hover:bg-[#8b5cf6]/35 hover:scale-105 active:scale-95"
                          : "border-white/10 bg-white/5 hover:border-[#8b5cf6]/45 text-white active:scale-95 disabled:opacity-50"
                      }`}
                      title={isRecording ? "Stop capture and translate" : "Start capturing microphone input"}
                    >
                      <span className="material-symbols-outlined text-2xl group-hover:text-[#d0bcff]">
                        {isRecording ? "stop" : "mic"}
                      </span>
                    </button>
                  </div>

                  {/* Playback card for recorded user voice */}
                  {audioUrl && (
                    <CustomAudioPlayer src={audioUrl} label="Local Record" />
                  )}
                </div>  </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Output Context (Neural Translation Output) */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex-1 flex flex-col premium-card overflow-hidden">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40 select-none">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#cbc3d7]/60">
                      [02] Output_Buffer (Hindi)
                    </span>
                  </div>
                  
                  {/* Actions (Copy / Save) */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-white/5 rounded-lg text-[#cbc3d7] hover:text-[#8b5cf6] transition-all flex items-center gap-1.5"
                      title="Copy translated output to clipboard"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {copied ? "check" : "content_copy"}
                      </span>
                      {copied && <span className="font-mono text-[9px] text-[#8b5cf6] uppercase tracking-wider">Copied</span>}
                    </button>
                    <button 
                      className="p-2 hover:bg-white/5 rounded-lg text-[#cbc3d7] hover:text-[#8b5cf6] transition-all"
                      title="Save translation log"
                    >
                      <span className="material-symbols-outlined text-lg">save</span>
                    </button>
                  </div>
                </div>

                {/* Translation output display block */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                    <div className="flex justify-between items-center select-none border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-[#adc6ff] uppercase tracking-widest font-bold">
                        Target Language: HI-IN (NLLB-200-DISTILLED)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#adc6ff]/10 text-[#adc6ff] font-mono select-none">
                        Active Layer
                      </span>
                    </div>
                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                          <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-ping" />
                          <p className="font-mono text-[9px] text-[#adc6ff] uppercase tracking-widest font-bold">
                            [NLLB CORE] Running sequence translation...
                          </p>
                        </div>
                        <div className="font-mono text-[11px] text-zinc-500 space-y-1">
                          <div>&gt; Loading NLLB-200-Distilled translation layer...</div>
                          <div>&gt; Aligning multilingual context vectors (EN --&gt; HI)...</div>
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <span className="w-1.5 h-3 bg-[#adc6ff] animate-pulse" />
                            <span>Synthesizing output pitch spectrograms...</span>
                          </div>
                        </div>
                        <SkeletonLoader lines={3} />
                      </div>
                    ) : (
                      <p className="text-lg text-white font-light leading-relaxed">
                        {outputText}
                      </p>
                    )}
                  </div>
                </div>

                {/* TTS Synthetic Audio player when available */}
                {ttsAudioUrl && (
                  <div className="p-4 border-t border-white/5 bg-black/40 flex flex-col gap-3">
                    <CustomAudioPlayer src={ttsAudioUrl} label="Generated Speech" />
                  </div>
                )}

                {/* Inference/Translation Confidence gauge */}
                <div className="p-6 border-t border-white/5 bg-black/40 select-none">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-[10px] uppercase text-[#cbc3d7]/60 tracking-wider">
                      Inference_Confidence
                    </span>
                    <span className="font-mono text-[10px] text-[#8b5cf6] font-bold">
                      95.00%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#adc6ff] w-[95%] transition-all duration-700"></div>
                  </div>
                </div>

                {/* Footer Action Buttons panel aligned inside card footer */}
                <div className="p-4 border-t border-white/5 bg-black/40 flex justify-end gap-3 select-none">
                  <button
                    onClick={() => {
                      setOutputText("");
                      setTranscript("");
                      setTtsAudioUrl(null);
                      setAudioUrl(null);
                      setAudioBlob(null);
                    }}
                    disabled={isProcessing}
                    className="font-mono text-[10px] uppercase tracking-widest px-5 py-3 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/15 transition-all rounded-lg active:scale-95 disabled:opacity-50"
                  >
                    Clear_Cache
                  </button>
                  <button
                    onClick={playTTSAudio}
                    disabled={!ttsAudioUrl || isPlayingTTS}
                    className={`font-mono text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 ${
                      !ttsAudioUrl || isPlayingTTS
                        ? "border border-white/5 bg-white/2 text-zinc-600 cursor-not-allowed"
                        : "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/15"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">volume_up</span>
                    Play_TTS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status footer bar at the bottom */}
          <footer className="h-12 bg-black border-t border-white/5 w-full flex items-center px-6 justify-between select-none absolute bottom-0 md:relative shrink-0 z-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 border border-white/10 rounded-lg bg-white/5">
                <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                  Source
                </span>
                <span className="font-mono text-[10px] text-white font-bold">EN-US</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 border border-white/10 rounded-lg bg-white/5">
                <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                  Target
                </span>
                <span className="font-mono text-[10px] text-[#d0bcff] font-bold">HI-IN</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 border border-white/10 rounded-lg bg-white/5">
                <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                  Active pipeline
                </span>
                <span className="font-mono text-[10px] text-[#adc6ff] font-bold">
                  WHISPER + NLLB + COGNITIVE VOCODER
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse"></span>
                <span className="font-mono text-[9px] text-[#cbc3d7]/60 uppercase tracking-wider">
                  Voxa Engine Ready
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-16 z-50">
        <Link
          href="/workspace"
          className="flex flex-col items-center gap-1 text-[#8b5cf6] flex-1 py-1"
        >
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-medium font-sans">Workspace</span>
        </Link>
        <Link
          href="/technology"
          className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1"
        >
          <span className="material-symbols-outlined text-[22px]">insights</span>
          <span className="text-[10px] font-medium font-sans">Pipeline</span>
        </Link>
        <Link
          href="/design-system"
          className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1"
        >
          <span className="material-symbols-outlined text-[22px]">palette</span>
          <span className="text-[10px] font-medium font-sans">Specs</span>
        </Link>
      </div>
    </div>
  );
}
