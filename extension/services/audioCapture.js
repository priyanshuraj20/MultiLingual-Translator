// audioCapture.js - Resamples and converts tab capture stream to Int16 PCM (FIXED)

import { sendChunk } from "./webSocket.js";

let audioContext = null;
let sourceNode = null;
let processorNode = null;
let lastAudioSendTime = Date.now();
let silenceInterval = null;
let isCapturing = false;

/**
 * Capture raw tab audio stream, resample to 16kHz, and stream as 16-bit mono PCM
 */
export function startAudioCapture(mediaStream) {
  try {
    // 1. Create AudioContext at 16000Hz (Whisper STT expected sample rate)
    audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000,
    });

    // 2. Wrap tab capture MediaStream as a web audio source
    sourceNode = audioContext.createMediaStreamSource(mediaStream);

    // 3. Connect to output speakers so the user can still hear the call audio
    // COMMENTED OUT: We block the original English audio output so the user ONLY hears the translated speech.
    // sourceNode.connect(audioContext.destination);

    // 4. Create ScriptProcessorNode with buffer size 4096, 1 input channel, 1 output channel
    processorNode = audioContext.createScriptProcessor(4096, 1, 1);

    isCapturing = true;

    processorNode.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0); // Float32Array of audio samples
      
      // Convert Float32 samples to 16-bit signed integer PCM (Int16Array)
      const int16Buffer = new Int16Array(inputData.length);
      const bandSize = Math.floor(inputData.length / 10);
      const amplitudes = [];

      // Calculate 10-band average amplitudes for active wave visualizer
      for (let b = 0; b < 10; b++) {
        let sum = 0;
        const start = b * bandSize;
        const end = start + bandSize;
        for (let i = start; i < end; i++) {
          const sampleVal = inputData[i];
          sum += Math.abs(sampleVal);

          // Clip float sample to range [-1.0, 1.0] and map to Int16 bounds
          const s = Math.max(-1, Math.min(1, sampleVal));
          int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        const avg = sum / bandSize;
        // Scale average range (typically 0.0 to ~0.5 for active speech) to a bar height range [3, 20]
        const scaledAmp = Math.max(3, Math.min(Math.floor(avg * 45) + 3, 20));
        amplitudes.push(scaledAmp);
      }

      // Broadcast real-time wave heights to extension panels and in-page subtitles bubble
      chrome.runtime.sendMessage({
        type: "VOXA_WAVE",
        amplitudes: amplitudes
      });

      // ✅ FIX 2: ALWAYS stream the binary Int16 PCM data over the WebSocket
      // Even if silent, we send it to maintain continuous flow and prevent backend timeout
      sendChunk(int16Buffer.buffer);
      lastAudioSendTime = Date.now();
    };

    // 5. Connect processing pipeline nodes
    sourceNode.connect(processorNode);
    processorNode.connect(audioContext.destination);

    // ✅ FIX 2 PART 2: Send silence chunks if no audio for 100ms
    // This handles gaps between speech and ensures backend always has data
    silenceInterval = setInterval(() => {
      if (!isCapturing) return;
      
      const timeSinceLastSend = Date.now() - lastAudioSendTime;
      
      // If no audio sent in last 100ms, send silence to keep connection alive
      if (timeSinceLastSend > 100) {
        const silenceBuffer = new Int16Array(4096); // All zeros = silence
        sendChunk(silenceBuffer.buffer);
        lastAudioSendTime = Date.now();
        console.log("📍 Silence chunk sent (no audio detected)");
      }
    }, 100);

    console.log("✅ Tab audio resampled and 16-bit PCM converter pipeline active.");
  } catch (err) {
    console.error("❌ Failed to start audio processing context:", err);
  }
}

/**
 * Shut down the audio processing pipeline and release context handles
 */
export function stopAudioCapture() {
  console.log("🔴 Shutting down audio capture pipeline...");
  
  isCapturing = false;

  // Clear silence interval
  if (silenceInterval) {
    clearInterval(silenceInterval);
    silenceInterval = null;
  }

  if (processorNode) {
    processorNode.disconnect();
    processorNode.onaudioprocess = null;
    processorNode = null;
  }

  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }

  if (audioContext && audioContext.state !== "closed") {
    audioContext.close();
    audioContext = null;
  }
  
  // Clear visualizer waves in sidepanel/widget
  chrome.runtime.sendMessage({
    type: "VOXA_WAVE",
    amplitudes: []
  });
}
