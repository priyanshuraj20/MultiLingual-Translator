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

  // Dynamic Language Support (200+ NLLB Languages)
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState("eng_Latn");
  const [targetLanguage, setTargetLanguage] = useState("hin_Deva");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("http://localhost:8000/languages");
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
      setError("🎤 Microphone Access Denied: Please click the lock/settings icon in your browser's address bar and set Microphone permissions to 'Allow' to record audio.");
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

    // Validate size to prevent uploading empty files
    if (!blob || blob.size < 1000) {
      setError("⚠️ Empty Recording: No microphone sound was detected. Please ensure your microphone is active and speak clearly before clicking stop.");
      setIsProcessing(false);
      return;
    }

    try {
      // Assemble standard multi-part form data
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");
      formData.append("source_lang", sourceLanguage);
      formData.append("target_lang", targetLanguage);

      console.log(`📤 Sending speech translation request from ${sourceLanguage} to ${targetLanguage}...`);

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
        if (!data.transcript || !data.transcript.trim()) {
          setError("🔇 No Speech Detected: Whisper ASR did not capture any voice words. Please speak louder or closer to the microphone.");
          setTranscript("[No voice captured]");
          setOutputText("[No translation generated]");
          return;
        }

        setTranscript(data.transcript || "");
        setOutputText(data.translated_text || "");
        setTtsAudioUrl(data.output_audio_url || null);

        // 💡 Auto-play target voice output instantly using browser SpeechSynthesis
        // This eliminates ElevenLabs latency on initial playback, making the app feel extremely fast!
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const synth = window.speechSynthesis;
          synth.cancel(); // Terminate any active speech queues
          const utterance = new SpeechSynthesisUtterance(data.translated_text || "");
          
          // Map target NLLB code prefix to browser synthesis locale code
          const langPrefix = targetLanguage.split("_")[0];
          const isoMapper: { [key: string]: string } = {
            eng: "en-US", hin: "hi-IN", spa: "es-ES", fra: "fr-FR", deu: "de-DE",
            ita: "it-IT", jpn: "ja-JP", zho: "zh-CN", rus: "ru-RU", ara: "ar-SA",
            por: "pt-PT", urd: "ur-PK", ben: "bn-IN", pan: "pa-IN", mar: "mr-IN",
            tam: "ta-IN", tel: "te-IN", guj: "gu-IN", kan: "kn-IN", mal: "ml-IN",
            kor: "ko-KR", vie: "vi-VN", tha: "th-TH", ind: "id-ID", tur: "tr-TR",
            nld: "nl-NL", pol: "pl-PL", swe: "sv-SE", dan: "da-DK", fin: "fi-FI",
            ces: "cs-CZ", slk: "sk-SK", hun: "hu-HU", ron: "ro-RO", bul: "bg-BG",
            ukr: "uk-UA", ell: "el-GR", heb: "he-IL"
          };
          
          utterance.lang = isoMapper[langPrefix] || `${langPrefix}-${langPrefix.toUpperCase()}`;
          utterance.rate = 1.0;
          synth.speak(utterance);
        }
      } else {
        setError(`⚠️ Engine Failure: ${data.detail || "Speech translation server failed to process request."}`);
      }
    } catch (err) {
      console.error("Audio processing failure:", err);
      const isNetworkOffline = err instanceof TypeError && err.message.includes("Failed to fetch");
      if (isNetworkOffline) {
        setError("🔌 Connection Failed: Could not connect to the translation backend. Please check that your FastAPI local server is running at http://localhost:8000");
      } else {
        setError(
          `⚠️ Service Error: ${err instanceof Error ? err.message : "Internal system down"}`
        );
      }
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
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
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
                          <span 
                            id="streaming-cursor"
                            className="inline-block w-1.5 h-5 bg-white/30 ml-2 align-middle animate-streaming-cursor"
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
                      disabled={isProcessing}
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
                        <div className="font-mono text-[11px] text-zinc-500 space-y-1.5 pl-1 leading-relaxed">
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
