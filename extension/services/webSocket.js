// webSocket.js - Manages extension WebSocket connection to backend API (FIXED)

let socket = null;
let reconnectTimeout = null;
const RECONNECT_DELAY = 2000; // Reduced from 3000 for faster recovery
const MAX_RECONNECT_ATTEMPTS = 5;
let reconnectAttempts = 0;

/**
 * Connect to the backend WebSocket translation engine
 */
export function connectSocket() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("⚠️ WebSocket already connected, skipping duplicate connect");
    return;
  }

  // Load auth token from local storage
  chrome.storage.local.get("authToken", (data) => {
    const token = data.authToken || "no_token_provided";
    console.log("🔵 Attempting WebSocket connection with token to ws://127.0.0.1:8000/ws...");
    
    socket = new WebSocket(`ws://127.0.0.1:8000/ws?token=${encodeURIComponent(token)}`);
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      console.log("✅ WebSocket Connected successfully");
      reconnectAttempts = 0; // Reset on successful connection
      
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    socket.onclose = (event) => {
      console.log(`❌ WebSocket Closed (Code: ${event.code}, Reason: ${event.reason})`);
      if (event.code === 4001) {
        chrome.runtime.sendMessage({
          type: "VOXA_AUTH_ERROR",
          error: "Invalid License Key. Please check settings!"
        }).catch(() => {});
        socket = null;
        return; // Stop reconnection on authentication error
      }
      socket = null;
      scheduleReconnect();
    };

    socket.onerror = (e) => {
      console.error("❌ WebSocket Error:", e);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 WebSocket message received:", data);
        
        // Dispatch original transcripts and translations back to background controller
        chrome.runtime.sendMessage({
          type: "VOXA_TRANSCRIPT",
          transcript: data.transcript,
          translated: data.translation,
        });
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };
  });
}

/**
 * Schedule automatic reconnection with exponential backoff
 */
function scheduleReconnect() {
  if (reconnectTimeout) return;
  
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error("❌ Max reconnection attempts reached. Stopping.");
    return;
  }

  // Exponential backoff: 2s, 4s, 8s, 16s, 32s
  const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
  reconnectAttempts++;
  
  console.log(`⏳ Scheduling WebSocket reconnect in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
  
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connectSocket();
  }, delay);
}

/**
 * Safely send binary PCM audio chunk
 */
export function sendChunk(chunk) {
  if (!socket) {
    console.warn("⚠️ WebSocket not initialized, cannot send chunk");
    return false;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.warn(`⚠️ WebSocket not open (state: ${socket.readyState}), attempting to reconnect...`);
    scheduleReconnect();
    return false;
  }

  try {
    socket.send(chunk);
    return true;
  } catch (err) {
    console.error("❌ Failed to send chunk:", err);
    return false;
  }
}

/**
 * Disconnect socket and abort auto-reconnection triggers
 */
export function disconnectSocket() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  
  if (socket) {
    // Temporarily disable onclose to prevent auto-reconnect
    const originalOnClose = socket.onclose;
    socket.onclose = null;
    
    try {
      socket.close(1000, "Client disconnecting");
    } catch (err) {
      console.warn("Error closing WebSocket:", err);
    }
    
    socket = null;
    console.log("✅ WebSocket deliberately disconnected.");
  }
  
  reconnectAttempts = 0;
}

/**
 * Check if WebSocket is connected
 */
export function isSocketConnected() {
  return socket && socket.readyState === WebSocket.OPEN;
}
