// sidepanel.js - Voxa Extension Sidepanel Controller

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // WebGL Shader Background (Obsidian Flux Theme)
  // ==========================================
  const initShaderBackground = () => {
    const canvas = document.getElementById("shader-canvas");
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported in extension sidepanel.");
      return;
    }

    const vsSource = `
      attribute vec4 position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = position.xy * 0.5 + 0.5;
        gl_Position = position;
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        float time = u_time * 0.15;
        vec3 color = vec3(0.04, 0.03, 0.06); 
        
        for(float i = 1.0; i < 4.0; i++){
          uv.x += 0.3 / i * sin(i * 3.0 * uv.y + time + 0.5);
          uv.y += 0.3 / i * cos(i * 3.0 * uv.x + time + 0.3);
        }
        
        float intensity = sin(uv.x + uv.y + time);
        vec3 accent = vec3(0.54, 0.36, 0.96); // Electric Purple
        color += accent * 0.12 * (1.0 / length(uv - 0.5));
        color *= 0.8 + 0.2 * intensity;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("WebGL program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionLoc = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,  1, -1, -1,  1,
        -1,  1,  1, -1,  1,  1,
      ]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");

    const resizeCanvas = () => {
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(window.innerHeight / 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId;
    const render = (time) => {
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener("unload", () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    });
  };

  initShaderBackground();

  // ==========================================
  // DOM Elements & UI State Management
  // ==========================================
  const selectSource = document.getElementById("select-source");
  const selectTarget = document.getElementById("select-target");
  const toggleWidget = document.getElementById("toggle-widget");
  const toggleSimulation = document.getElementById("toggle-simulation");
  
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");
  
  const btnRecord = document.getElementById("btn-record");
  const recordIcon = document.getElementById("record-icon");
  const recordDuration = document.getElementById("record-duration");
  const micStatusLabel = document.getElementById("mic-status-label");
  const waveformWave = document.getElementById("waveform-wave");
  
  const transcriptContainer = document.getElementById("transcript-container");
  const outputContainer = document.getElementById("output-container");
  
  const confidencePercentage = document.getElementById("confidence-percentage");
  const confidenceBar = document.getElementById("confidence-bar");
  
  const btnClear = document.getElementById("btn-clear");
  const btnPlayTts = document.getElementById("btn-play-tts");
  
  const toast = document.getElementById("error-toast");
  const toastMessage = document.getElementById("error-message");
  const btnCloseToast = document.getElementById("btn-close-toast");

  // Disable simulation mode permanently (Do NOT modify HTML layout)
  if (toggleSimulation) {
    toggleSimulation.checked = false;
    toggleSimulation.disabled = true;
    const parentContainer = toggleSimulation.closest(".setting-row");
    if (parentContainer) {
      parentContainer.style.opacity = "0.5";
      parentContainer.style.pointerEvents = "none";
    }
  }

  // State flags
  let isRecording = false;
  let isProcessing = false;
  let timerInterval = null;
  let timerSeconds = 0;

  // Active Tab cache to keep user gestures fully synchronous
  let storedActiveTabId = null;
  let storedActiveTabUrl = "";

  // ✅ FIX: Use a Promise wrapper so that startLiveTabCapture waits for tab identification to complete
  const tabReadyPromise = new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        storedActiveTabId = tabs[0].id;
        storedActiveTabUrl = tabs[0].url || "";
        console.log("Initial active tab recorded in sidepanel:", storedActiveTabId, storedActiveTabUrl);
      }
      resolve();
    });
  });

  // Keep active tab ID and URL updated when user switches tabs
  chrome.tabs.onActivated.addListener((activeInfo) => {
    storedActiveTabId = activeInfo.tabId;
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      storedActiveTabUrl = tab?.url || "";
      console.log("Active tab changed to:", storedActiveTabId, storedActiveTabUrl);
    });
  });

  // Keep active tab ID and URL updated when user navigates or updates a tab
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && tab.windowId === chrome.windows.WINDOW_ID_CURRENT) {
      storedActiveTabId = tabId;
      storedActiveTabUrl = tab.url || "";
    }
  });

  // Translation metrics
  let lastTranscript = "";
  let lastTranslated = "";

  // Onboarding & License Key Handles
  const inputAuthToken = document.getElementById("input-auth-token");
  const btnSaveToken = document.getElementById("btn-save-token");
  const btnToggleGuide = document.getElementById("btn-toggle-guide");
  const onboardingCardBody = document.getElementById("onboarding-card-body");
  const onboardingGraphic = document.getElementById("img-onboarding-graphic");

  if (onboardingGraphic) {
    onboardingGraphic.src = chrome.runtime.getURL("assets/setup_guide.png");
  }

  // Load configuration settings from storage
  chrome.storage.local.get([
    "sourceLang", "targetLang", "widgetEnabled", "authToken"
  ], (data) => {
    if (data.sourceLang) selectSource.value = data.sourceLang;
    if (data.targetLang) selectTarget.value = data.targetLang;
    if (data.widgetEnabled !== undefined) toggleWidget.checked = data.widgetEnabled;
    if (data.authToken) inputAuthToken.value = data.authToken;
  });

  // Sync settings when modified
  const updateSettings = () => {
    chrome.storage.local.set({
      sourceLang: selectSource.value,
      targetLang: selectTarget.value,
      widgetEnabled: toggleWidget.checked
    });
  };

  [selectSource, selectTarget, toggleWidget].forEach(el => {
    el.addEventListener("change", updateSettings);
  });

  // Save auth token
  btnSaveToken.addEventListener("click", () => {
    chrome.storage.local.set({ authToken: inputAuthToken.value }, () => {
      alert("License Key saved successfully!");
    });
  });

  // Collapse / Expand setup guide
  let isGuideHidden = false;
  btnToggleGuide.addEventListener("click", () => {
    isGuideHidden = !isGuideHidden;
    if (isGuideHidden) {
      onboardingCardBody.style.display = "none";
      btnToggleGuide.textContent = "Show Guide";
    } else {
      onboardingCardBody.style.display = "flex";
      btnToggleGuide.textContent = "Hide Guide";
    }
  });

  // Toast Helpers
  const showError = (message) => {
    toastMessage.textContent = message;
    toast.style.display = "flex";
  };

  btnCloseToast.addEventListener("click", () => {
    toast.style.display = "none";
  });

  // Status Indicator States
  const setStatus = (state) => {
    statusDot.className = "dot-indicator";
    if (state === "recording") {
      statusDot.classList.add("bg-recording");
      statusText.textContent = "Listening";
      statusText.style.color = "#ff5c5c";
    } else if (state === "processing") {
      statusDot.classList.add("bg-processing");
      statusText.textContent = "Translating";
      statusText.style.color = "var(--color-tertiary)";
    } else {
      statusDot.classList.add("bg-ready");
      statusText.textContent = "Standby";
      statusText.style.color = "var(--color-secondary)";
    }
  };

  // Timer formatter
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Clear dashboard panel
  btnClear.addEventListener("click", () => {
    transcriptContainer.innerHTML = `<p class="placeholder-text">Click the microphone button to begin capturing live audio signals.</p>`;
    outputContainer.innerHTML = `<p class="placeholder-text">Translations will be written here in real-time.</p>`;
    lastTranscript = "";
    lastTranslated = "";
    btnPlayTts.classList.add("disabled");
    btnPlayTts.disabled = true;

    // Send clear signal to page widget
    chrome.runtime.sendMessage({
      type: "VOXA_TRANSCRIPT",
      transcript: "",
      translated: "",
      isRecording: false,
      isProcessing: false
    });
  });

  // ==========================================
  // Text-To-Speech Playback Engine
  // ==========================================
  const playTtsSpeech = (text) => {
    if (!text) return;
    try {
      const audio = new Audio(`http://localhost:8000/speech/output-audio?cb=${Date.now()}`);
      audio.play().catch(e => {
        console.warn("Audio auto-playback blocked:", e);
      });
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  // Play synthetic speech manual button trigger
  btnPlayTts.addEventListener("click", () => {
    playTtsSpeech(lastTranslated);
  });

  // ==========================================
  // Tab Capture Trigger (API Mode)
  // ==========================================
  const startLiveTabCapture = async () => {
    // ✅ Wait for the async tab query to complete first to ensure valid storedActiveTabId
    await tabReadyPromise;

    toast.style.display = "none";
    
    if (!storedActiveTabId) {
      showError("Unable to locate active browser tab.");
      stopRecordingSession();
      return;
    }

    // Verify synchronously that the target tab is a Google Meet tab
    if (!storedActiveTabUrl || !storedActiveTabUrl.includes("meet.google.com")) {
      showError("Please open Google Meet tab before starting capture.");
      stopRecordingSession();
      return;
    }

    console.log("Synchronously obtaining MediaStream ID for Meet tab ID:", storedActiveTabId);
    
    // Call getMediaStreamId completely synchronously inside the click handler to preserve gesture
    chrome.tabCapture.getMediaStreamId({ targetTabId: storedActiveTabId }, (streamId) => {
      if (chrome.runtime.lastError || !streamId) {
        const errorMsg = chrome.runtime.lastError?.message || "Invalid stream ID";
        console.error("Tab Capture failed:", errorMsg);
        
        // Show context-specific invocation guide toast to the user
        showError("⚠️ Capture permission required. Please right-click on the Google Meet page and select 'Activate Voxa Capture' (or press Ctrl+Shift+U) to start.");
        stopRecordingSession();
        return;
      }

      console.log("✅ Tab Capture MediaStream ID generated inside sidepanel click:", streamId);

      // Now pass the generated streamId to the background controller to setup offscreen context
      chrome.runtime.sendMessage({
        type: "START_TAB_CAPTURE_REQUEST",
        streamId: streamId,
        tabId: storedActiveTabId
      }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          const errorMsg = response?.error || chrome.runtime.lastError?.message || "Capture request failed";
          showError(`Tab capture failed: ${errorMsg}`);
          stopRecordingSession();
        } else {
          console.log("Tab Capture session configured in background successfully.");
          micStatusLabel.textContent = "Tab Captured";
          setStatus("recording");
          
          chrome.runtime.sendMessage({
            type: "VOXA_STATE_CHANGE",
            isRecording: true,
            isProcessing: false
          });
        }
      });
    });
  };

  const stopLiveTabCapture = () => {
    chrome.runtime.sendMessage({ type: "STOP_TAB_CAPTURE_REQUEST" }, () => {
      micStatusLabel.textContent = "Inactive";
      setStatus("standby");
      
      chrome.runtime.sendMessage({
        type: "VOXA_STATE_CHANGE",
        isRecording: false,
        isProcessing: false
      });
    });
  };

  // Main session toggle
  const startRecordingSession = () => {
    isRecording = true;
    btnRecord.classList.add("recording");
    recordIcon.textContent = "stop";

    // Reset timer
    timerSeconds = 0;
    recordDuration.textContent = "00:00";
    timerInterval = setInterval(() => {
      timerSeconds++;
      recordDuration.textContent = formatTime(timerSeconds);
    }, 1000);

    // Always start real-time live tab capture
    startLiveTabCapture();
  };

  const stopRecordingSession = () => {
    isRecording = false;
    btnRecord.classList.remove("recording");
    recordIcon.textContent = "mic";

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;

    stopLiveTabCapture();
  };

  btnRecord.addEventListener("click", () => {
    if (isRecording) {
      stopRecordingSession();
    } else {
      startRecordingSession();
    }
  });

  // Query global meeting status on panel initialization
  chrome.runtime.sendMessage({ type: "GET_MEETING_STATUS" }, (response) => {
    if (response && response.meetingActive) {
      console.log("Detected active meeting at launch. Room tab ID:", response.meetingTabId);
    }
  });

  // Receive message streams from offscreen WebSocket or background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case "ACTIVETAB_GRANTED":
        console.log("✅ Tab capture permission granted in background via contextMenu/shortcut.");
        isRecording = true;
        btnRecord.classList.add("recording");
        recordIcon.textContent = "stop";
        micStatusLabel.textContent = "Tab Captured";
        setStatus("recording");
        
        // Start duration timer
        if (!timerInterval) {
          timerSeconds = 0;
          recordDuration.textContent = "00:00";
          timerInterval = setInterval(() => {
            timerSeconds++;
            recordDuration.textContent = formatTime(timerSeconds);
          }, 1000);
        }
        
        chrome.runtime.sendMessage({
          type: "VOXA_STATE_CHANGE",
          isRecording: true,
          isProcessing: false
        });
        break;

      case "CAPTURE_PERMISSION_DENIED":
        showError(`Permission Denied: ${message.error || "Request rejected"}. Please right-click the Google Meet page and select 'Activate Voxa Capture'.`);
        stopRecordingSession();
        break;

      case "VOXA_AUTH_ERROR":
        showError(`Authorization Failed: ${message.error || "Invalid License Key"}.`);
        stopRecordingSession();
        break;

      case "VOXA_TRANSCRIPT":
        if (message.transcript) {
          transcriptContainer.innerHTML = `<p class="scroll-text">${message.transcript}</p>`;
          lastTranscript = message.transcript;
        }
        if (message.translated) {
          outputContainer.innerHTML = `<p class="scroll-text">${message.translated}</p>`;
          
          // Only play if the translated text has actually CHANGED, to prevent audio overlap
          if (message.translated !== lastTranslated) {
            lastTranslated = message.translated;
            
            // Enable TTS button
            btnPlayTts.classList.remove("disabled");
            btnPlayTts.disabled = false;
            
            // Trigger speech playback automatically
            playTtsSpeech(message.translated);
          }
        }
        
        transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
        outputContainer.scrollTop = outputContainer.scrollHeight;
        break;

      case "VOXA_WAVE":
        const bars = waveformWave.getElementsByClassName("wave-bar");
        if (message.amplitudes && message.amplitudes.length) {
          waveformWave.classList.add("wave-bars-active");
          const count = Math.min(message.amplitudes.length, bars.length);
          for (let i = 0; i < count; i++) {
            bars[i].style.height = `${message.amplitudes[i]}px`;
          }
        } else {
          waveformWave.classList.remove("wave-bars-active");
          for (let i = 0; i < bars.length; i++) {
            bars[i].style.height = "4px";
          }
        }
        break;

      case "VOXA_STATE_CHANGE":
        if (message.isRecording) {
          setStatus("recording");
        } else if (message.isProcessing) {
          setStatus("processing");
        } else {
          setStatus("standby");
        }
        break;
    }
  });
});
