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
  // React State variables
  // ==========================================
  const [isRecording, setIsRecording] = useState(false);       // Tracks if microphone is actively capturing voice
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Stores raw audio data block in webm format
  const [audioUrl, setAudioUrl] = useState<string | null>(null);   // URL representation of the recorded audio for local playing
  const [isProcessing, setIsProcessing] = useState(false);     // Tracks if upload translation fetch is pending
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);     // Tracks if synthesized translation voice is playing
  const [copied, setCopied] = useState(false);                 // Visual feedback state when copying translation output
  const [error, setError] = useState("");                       // Error alert state
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // Dynamic Language Support (200+ NLLB Languages)
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState("eng_Latn");
  const [targetLanguage, setTargetLanguage] = useState("hin_Deva");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const res = await fetch(`${backendUrl}/languages`);
        if (res.ok) {
          const data = await res.json();
          setLanguages(data);
        } else {
          console.error("Languages endpoint returned error status:", res.status);
        }
      } catch (err) {
        console.error("Failed to load backend NLLB languages:", err);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#install") {
        setShowInstallModal(true);
      }
    };
    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Translation metrics from FastAPI backend
  const [transcript, setTranscript] = useState("");            // Real-time transcribed text of the spoken English input
  const [outputText, setOutputText] = useState(
    "Welcome to the applied technology conference. Today we will explore the future of neural translation."
  );                                                            // Target translated text (Hindi) returned from the server
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [correctedTranscript, setCorrectedTranscript] = useState("");
  const [segments, setSegments] = useState<{ speaker: string; original: string; corrected: string; translation: string }[]>([]);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null); // URL path to access synthesized TTS speech on the server

  // ==========================================
  // References for non-reactive items
  // ==========================================
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAudioSendTimeRef = useRef<number>(Date.now());
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
  
  // Initiates microphone capture stream and WebSocket connection
  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 1. Establish WebSocket connection for streaming
      // Since BACKEND_URL isn't explicitly defined globally in this scope block anymore, we use process.env directly
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const wsUrl = backendUrl.replace("http://", "ws://").replace("https://", "wss://");
      const ws = new WebSocket(`${wsUrl}/ws?token=voxa_local_dev&source_lang=${sourceLanguage}&target_lang=${targetLanguage}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected for audio streaming");
        setIsRecording(true);
        setIsProcessing(true); // Indicate that we are processing in real-time
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const speaker = data.speaker || "Speaker A";
          const raw = data.original_transcript || data.transcript || "";
          const corrected = data.corrected_transcript || data.transcript || "";
          const translation = data.translation || "";

          if (raw) setOriginalTranscript(raw);
          if (corrected) {
            setCorrectedTranscript(corrected);
            setTranscript(corrected);
          }
          if (translation) setOutputText(translation);

          if (raw || corrected || translation) {
            setSegments((prev) => {
              if (prev.length === 0 || prev[prev.length - 1].speaker !== speaker) {
                return [...prev, { speaker, original: raw, corrected, translation }];
              } else {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  speaker,
                  original: raw || updated[updated.length - 1].original,
                  corrected: corrected || updated[updated.length - 1].corrected,
                  translation: translation || updated[updated.length - 1].translation
                };
                return updated;
              }
            });
          }
          
          if (data.output_audio_url) {
             setTtsAudioUrl(data.output_audio_url);
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setError("🔌 Connection Failed: Could not connect to the translation backend.");
        stopRecording();
      };

      ws.onclose = () => {
        console.log("❌ WebSocket closed");
        setIsRecording(false);
        setIsProcessing(false);
      };

      // 2. Setup AudioContext and PCM Pipeline
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const sourceNode = audioContext.createMediaStreamSource(stream);
      mediaStreamSourceRef.current = sourceNode;

      const processorNode = audioContext.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processorNode;

      processorNode.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Buffer = new Int16Array(inputData.length);
        
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        wsRef.current.send(int16Buffer.buffer);
        lastAudioSendTimeRef.current = Date.now();
      };

      sourceNode.connect(processorNode);
      processorNode.connect(audioContext.destination);

      silenceIntervalRef.current = setInterval(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        if (Date.now() - lastAudioSendTimeRef.current > 3000) {
          const silenceBuffer = new Int16Array(4096);
          wsRef.current.send(silenceBuffer.buffer);
          lastAudioSendTimeRef.current = Date.now();
        }
      }, 1000);

    } catch (err) {
      setError("🎤 Microphone Access Denied: Please check permissions.");
      console.error("Recording start error:", err);
    }
  };

  // Stops recording and releases microphone resources
  const stopRecording = () => {
    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
    }
    
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current.onaudioprocess = null;
      processorNodeRef.current = null;
    }

    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
      mediaStreamSourceRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsRecording(false);
    setIsProcessing(false);
  };

  // ==========================================
  // TEXT-TO-SPEECH (TTS) PLAYBACK CONTROL
  // ==========================================
  
  // Initiates browser playback for the synthesized translation audio file from server URL
  const playTTSAudio = () => {
    if (!outputText) {
      setError("No translation text found to play.");
      return;
    }

    // Use server-side ElevenLabs synthesized audio if available
    if (ttsAudioUrl) {
      try {
        const audio = new Audio(ttsAudioUrl);
        setIsPlayingTTS(true);
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
      return;
    }

    // Fallback: Use browser native SpeechSynthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(outputText);
        
        // Simple mapping from NLLB prefix to browser locales
        const langPrefix = targetLanguage.split("_")[0];
        const isoMapper: Record<string, string> = {
          eng: "en-US",
          hin: "hi-IN",
          jpn: "ja-JP",
          spa: "es-ES",
          fra: "fr-FR",
          deu: "de-DE",
          zho: "zh-CN",
          rus: "ru-RU",
          ara: "ar-SA",
          por: "pt-BR",
          ita: "it-IT",
          kor: "ko-KR"
        };
        
        utterance.lang = isoMapper[langPrefix] || `${langPrefix}-${langPrefix.toUpperCase()}`;
        setIsPlayingTTS(true);
        utterance.onend = () => setIsPlayingTTS(false);
        utterance.onerror = () => setIsPlayingTTS(false);
        
        synth.speak(utterance);
      } catch (err) {
        console.error("Local SpeechSynthesis failed:", err);
        setIsPlayingTTS(false);
      }
    } else {
      setError("Local voice synthesis not supported in this browser.");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-[#e7e0ed] relative font-sans">
      {/* Interactive shader flow background */}
      <ShaderBackground />

      <Header onInstallClick={() => setShowInstallModal(true)} />
      
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
          <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
            
            {/* LEFT COLUMN: Input Stream Context (Whisper ASR) */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0c0a15]/90 to-[#120a22]/90 border border-white/5 hover:border-[#8b5cf6]/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl relative group">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#0f0c1b]/60 backdrop-blur-md select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : isProcessing ? "bg-[#ffb869] animate-pulse" : "bg-zinc-500"}`} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      [01] Input Stream (ASR)
                    </span>
                  </div>
                  <div className="font-mono text-[9px] px-2.5 py-1 rounded bg-white/5 text-[#d0bcff] uppercase tracking-widest font-bold">
                    {isRecording ? "Listening" : isProcessing ? "Processing" : "Standby"}
                  </div>
                </div>

                {/* Speech transcript text display */}
                <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                  {isProcessing && !transcript ? (
                    <div className="bg-[#8b5cf6]/5 p-6 rounded-xl border border-[#8b5cf6]/10 space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
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
                    <div className="bg-[#8b5cf6]/5 p-6 rounded-xl border border-[#8b5cf6]/20 flex flex-col gap-3">
                      <div className="flex justify-between items-center select-none border-b border-[#8b5cf6]/10 pb-2">
                        <span className="font-mono text-[9px] text-[#d0bcff] uppercase tracking-widest font-bold">
                          Acoustic Transcription
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#8b5cf6]/10 text-[#d0bcff] font-mono select-none">
                          Whisper v3
                        </span>
                      </div>
                      <p className="text-lg text-white font-sans font-light leading-relaxed">
                        {transcript}
                        {/* Blinking prompt cursor from Stitch mockup */}
                        <span 
                          id="streaming-cursor"
                          className="inline-block w-1.5 h-5 bg-[#8b5cf6]/80 ml-2 align-middle animate-streaming-cursor shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                        />
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/3 p-6 rounded-xl border border-white/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center select-none border-b border-white/5 pb-2">
                        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                          System Status
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-500 font-mono select-none">
                          Standby
                        </span>
                      </div>
                      <p className="text-lg text-[#cbc3d7]/60 font-sans font-light leading-relaxed">
                        {isRecording
                          ? "🎤 Capturing acoustic signals... Speak clearly into your microphone."
                          : "Simulating translation on a web page. Press the microphone button below to start."}
                        {!isRecording && (
                          <span className="inline-block w-1.5 h-5 bg-white/30 ml-2 align-middle animate-streaming-cursor" />
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
                </div>
                
                {/* Local audio record trigger and player */}
                <div className="p-5 border-t border-white/5 bg-[#0f0c1b]/60 flex flex-col items-center gap-4 select-none">
                  {/* Radar pulsing ring active micro state */}
                  <div className="relative shrink-0">
                    {isRecording && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-[#8b5cf6]/40 animate-ping scale-150" />
                        <span className="absolute -inset-2 rounded-full border border-[#8b5cf6]/40 animate-pulse scale-125" />
                      </>
                    )}
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing && !isRecording}
                      className={`group w-16 h-16 flex items-center justify-center rounded-full border transition-all duration-300 relative z-10 ${
                        isRecording
                          ? "border-[#8b5cf6]/50 bg-gradient-to-tr from-[#7c3aed] to-[#8b5cf6] text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                          : "border-white/10 bg-white/5 hover:border-[#8b5cf6]/50 text-white hover:scale-105 active:scale-95 disabled:opacity-50 shadow-inner"
                      }`}
                      title={isRecording ? "Stop capture and translate" : "Start capturing microphone input"}
                    >
                      <span className="material-symbols-outlined text-3xl group-hover:text-white">
                        {isRecording ? "stop" : "mic"}
                      </span>
                    </button>
                  </div>

                  {/* Playback card for recorded user voice */}
                  {audioUrl && (
                    <div className="w-full max-w-xs">
                      <CustomAudioPlayer src={audioUrl} label="Local Record" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Output Context (Neural Translation Output) */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0c0a15]/90 to-[#120a22]/90 border border-white/5 hover:border-[#8b5cf6]/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl relative group">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#0f0c1b]/60 backdrop-blur-md select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#adc6ff]/20 flex items-center justify-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? "bg-[#adc6ff] animate-pulse" : "bg-[#adc6ff]/60"}`} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      [02] Output Buffer (Translation)
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
                  <div className="bg-white/3 p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                    <div className="flex justify-between items-center select-none border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-[#adc6ff] uppercase tracking-widest font-bold">
                        Target Language: {targetLanguage.toUpperCase()}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#adc6ff]/10 text-[#adc6ff] font-mono select-none">
                        Active Layer
                      </span>
                    </div>
                    {isProcessing && !outputText ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                          <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-ping" />
                          <p className="font-mono text-[9px] text-[#adc6ff] uppercase tracking-widest font-bold">
                            [NLLB CORE] Running sequence translation...
                          </p>
                        </div>
                        <div className="font-mono text-[11px] text-zinc-500 space-y-1.5 pl-1 leading-relaxed">
                          <div>&gt; Loading NLLB-Distilled translation layer...</div>
                          <div>&gt; Aligning multilingual context vectors (EN --&gt; HI)...</div>
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <span className="w-1.5 h-3 bg-[#adc6ff] animate-pulse" />
                            <span>Synthesizing output pitch spectrograms...</span>
                          </div>
                        </div>
                        <SkeletonLoader lines={3} />
                      </div>
                    ) : (
                      <p className="text-lg text-white font-sans font-light leading-relaxed">
                        {outputText}
                        {/* Blinking prompt cursor */}
                        <span 
                          id="streaming-cursor"
                          className="inline-block w-1.5 h-5 bg-[#adc6ff]/80 ml-2 align-middle animate-streaming-cursor shadow-[0_0_10px_rgba(173,198,255,0.6)]"
                        />
                      </p>
                    )}
                  </div>
                </div>

                {/* TTS Synthetic Audio player when available */}
                {ttsAudioUrl && (
                  <div className="p-4 border-t border-white/5 bg-[#0f0c1b]/60 flex flex-col gap-3">
                    <CustomAudioPlayer src={ttsAudioUrl} label="Generated Speech" />
                  </div>
                )}

                {/* Inference/Translation Confidence gauge */}
                <div className="p-6 border-t border-white/5 bg-black/20 select-none">
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
                <div className="p-5 border-t border-white/5 bg-[#0f0c1b]/60 flex justify-end gap-3 select-none">
                  <button
                    onClick={() => {
                      setOutputText("");
                      setTranscript("");
                      setOriginalTranscript("");
                      setCorrectedTranscript("");
                      setSegments([]);
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
                    disabled={!outputText || isPlayingTTS}
                    className={`font-mono text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 ${
                      !outputText || isPlayingTTS
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
              <div className="flex items-center gap-2 px-2.5 py-0.5 border border-white/10 rounded-lg bg-white/5">
                <label htmlFor="source-lang" className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest cursor-pointer select-none">
                  Source
                </label>
                <select
                  id="source-lang"
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="bg-transparent text-white font-mono text-[10px] font-bold outline-none border-none cursor-pointer pr-2 focus:ring-0 [&>option]:bg-black [&>option]:text-white"
                >
                  {languages.length > 0 ? (
                    languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))
                  ) : (
                    <option value="eng_Latn">English (Latin)</option>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2 px-2.5 py-0.5 border border-white/10 rounded-lg bg-white/5">
                <label htmlFor="target-lang" className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest cursor-pointer select-none">
                  Target
                </label>
                <select
                  id="target-lang"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-transparent text-[#d0bcff] font-mono text-[10px] font-bold outline-none border-none cursor-pointer pr-2 focus:ring-0 [&>option]:bg-black [&>option]:text-white"
                >
                  {languages.length > 0 ? (
                    languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))
                  ) : (
                    <option value="hin_Deva">Hindi (Devanagari)</option>
                  )}
                </select>
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
          href="/"
          className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1"
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[10px] font-medium font-sans">Home</span>
        </Link>
        <a
          href="#install"
          className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1"
        >
          <span className="material-symbols-outlined text-[22px]">download_for_offline</span>
          <span className="text-[10px] font-medium font-sans">Extension</span>
        </a>
      </div>

      {/* Centric Extension Setup Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl bg-[#0f0d15]/95 border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowInstallModal(false);
                window.location.hash = "";
              }}
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

                {/* Display License Key when extension is downloaded */}
                {hasDownloaded ? (
                  <div className="bg-emerald-500/10 border border-[#4ade80]/20 rounded-xl p-5 mb-6 text-left flex flex-col gap-3">
                    <span className="font-mono text-[9px] text-[#4ade80] uppercase tracking-widest font-bold">
                      🔑 YOUR VOXA LICENSE KEY
                    </span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        /* 
                          TODO: Later on when you implement user login/auth:
                          1. Retrieve the currently authenticated user's profile state.
                          2. Generate/fetch their unique random voxa license key from your SQL/NoSQL database.
                          3. Replace this static placeholder "voxa_local_dev" with the user's active key (e.g. user.licenseKey).
                        */
                        value="voxa_local_dev" 
                        className="bg-black/40 border border-white/10 rounded-lg p-2.5 font-mono text-xs text-white flex-1 outline-none select-all"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("voxa_local_dev");
                          alert("License key copied to clipboard!");
                        }}
                        className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 rounded-lg font-bold text-xs transition-all active:scale-95"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Copy this key and paste it inside the <strong>Onboarding & License Key</strong> field in the extension Sidepanel to activate Voxa capture capabilities.
                    </p>
                  </div>
                ) : (
                  /* Facts info box */
                  <div className="bg-white/3 border border-white/5 rounded-lg p-3 text-[11px] text-[#ffb869] font-mono mb-6">
                    💡 Voxa requires Developer Mode to load custom audio capture libraries. Secure License Token will sync on launch.
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href="/Voxa.zip" 
                  download="Voxa.zip" 
                  onClick={() => setHasDownloaded(true)}
                  className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 px-4 rounded-lg font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-[#8b5cf6]/20 transition-all duration-255"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download Extension Package
                </a>
                <button 
                  onClick={() => {
                    setShowInstallModal(false);
                    window.location.hash = "";
                  }}
                  className="border border-white/10 bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-lg font-bold text-sm text-center flex items-center justify-center gap-2 transition-all duration-255"
                >
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  Close and Use Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
