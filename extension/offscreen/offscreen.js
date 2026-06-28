// offscreen.js - Voxa Extension Offscreen Document Controller (FIXED)

import { connectSocket, disconnectSocket, sendChunk } from "../services/webSocket.js";
import { startAudioCapture, stopAudioCapture } from "../services/audioCapture.js";

let mediaStream = null;
let heartbeatInterval = null;

// Listen for message events
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "START_CAPTURE") {
    console.log("🔵 Starting Meet Tab Capture in Offscreen...");

    try {
      // 1. Establish the WebSocket connection via helper
      console.log("🔵 Connecting to WebSocket backend...");
      connectSocket();

      // ✅ FIX 1: Send heartbeat while getUserMedia initializes (takes 1-3 seconds)
      // This prevents the backend from timing out waiting for audio
      heartbeatInterval = setInterval(() => {
        try {
          // Send silence chunks to keep connection alive
          const silenceChunk = new Int16Array(4096); // All zeros = silence
          sendChunk(silenceChunk.buffer);
          console.log("💓 Heartbeat sent (silence chunk)");
        } catch (err) {
          console.error("Heartbeat send failed:", err);
        }
      }, 300); // Send every 300ms

      console.log("💓 Heartbeat started to prevent timeout...");

      // 2. Capture tab audio using the provided stream ID token
      console.log("🔵 Requesting Google Meet audio stream...");
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: "tab",
            chromeMediaSourceId: message.streamId,
          },
        },
        video: false,
      });

      console.log("✅ Google Meet Audio stream connected inside offscreen.");

      // 3. Stop heartbeat now that real audio is flowing
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
        console.log("✅ Heartbeat stopped, real audio capture taking over...");
      }

      // 4. Initiate raw PCM sampling and streaming
      startAudioCapture(mediaStream);

    } catch (err) {
      console.error("❌ Failed to capture tab audio in offscreen document:", err);
      
      // Stop heartbeat on error
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    }
  }

  if (message.type === "STOP_CAPTURE") {
    console.log("🔴 Stopping tab capture in offscreen...");
    
    // Clear heartbeat if still running
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    
    stopAudioCapture();
    
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
    
    disconnectSocket();
  }
});

// Signal back to background script that offscreen document is ready to receive streamId
chrome.runtime.sendMessage({ type: "OFFSCREEN_READY" });
