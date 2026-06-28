// floatingWidget.js - Voxa Extension Content Script

(function () {
  // Prevent duplicate injections
  if (document.getElementById("voxa-floating-widget")) {
    console.log("Voxa widget already injected.");
    return;
  }

  // Create widget container
  const container = document.createElement("div");
  container.id = "voxa-floating-widget";
  container.className = "voxa-widget-container";

  // Build HTML template with glassmorphism controls, mic button, and tooltip helper
  container.innerHTML = `
    <div class="voxa-widget-header" id="voxa-drag-handle">
      <div class="voxa-widget-logo-area">
        <div class="voxa-widget-logo-dot" id="voxa-status-dot"></div>
        <span class="voxa-widget-title">VOXA LIVE</span>
      </div>
      <div class="voxa-widget-controls">
        <div class="voxa-tooltip" id="voxa-widget-tooltip">Press Ctrl+Shift+U or Right-Click page to start</div>
        
        <button class="voxa-widget-btn" id="voxa-btn-mic" title="Start/Stop Capture">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1v11a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z"></path><path d="M19 10v1a7 7 0 0 1-14 0v-1"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        </button>
        
        <button class="voxa-widget-btn" id="voxa-btn-dashboard" title="Open Full Dashboard">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
        </button>

        <button class="voxa-widget-btn" id="voxa-btn-minimize" title="Minimize">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <button class="voxa-widget-btn" id="voxa-btn-close" title="Close">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
    <div class="voxa-widget-body" id="voxa-widget-body">
      <div class="voxa-text-section">
        <span class="voxa-section-label">Original Speech</span>
        <div class="voxa-transcript-box" id="voxa-transcript-text">
          <span class="voxa-placeholder-msg">Waiting for speech input...</span>
        </div>
      </div>
      <div class="voxa-text-section">
        <span class="voxa-section-label">Translation (Hindi)</span>
        <div class="voxa-translation-box" id="voxa-translation-text">
          <span class="voxa-placeholder-msg">Hindi translation will appear here.</span>
        </div>
      </div>
    </div>
    <div class="voxa-widget-footer">
      <span class="voxa-status-label" id="voxa-status-text">Standby</span>
      <div class="voxa-wave-visualizer" id="voxa-wave-bars">
        <!-- 10 waveform bars -->
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
        <div class="voxa-wave-bar"></div>
      </div>
    </div>
  `;

  // Inject into page body
  document.body.appendChild(container);

  // Hidden by default until action click or auto-show activates it
  container.style.display = "none";
  container.style.opacity = "0";
  container.style.transform = "scale(0.95)";

  // Core references
  const dragHandle = document.getElementById("voxa-drag-handle");
  const btnMic = document.getElementById("voxa-btn-mic");
  const btnDashboard = document.getElementById("voxa-btn-dashboard");
  const btnMinimize = document.getElementById("voxa-btn-minimize");
  const btnClose = document.getElementById("voxa-btn-close");
  const tooltip = document.getElementById("voxa-widget-tooltip");
  
  const statusDot = document.getElementById("voxa-status-dot");
  const statusText = document.getElementById("voxa-status-text");
  const transcriptBox = document.getElementById("voxa-transcript-text");
  const translationBox = document.getElementById("voxa-translation-text");
  const waveBarsContainer = document.getElementById("voxa-wave-bars");
  const waveBars = waveBarsContainer.getElementsByClassName("voxa-wave-bar");

  // State cache
  let isRecordingState = false;
  let tooltipTimeout = null;

  // ===============================
  // Widget Visibility Helpers
  // ===============================
  function showWidget() {
    container.style.display = "flex";
    requestAnimationFrame(() => {
      container.style.opacity = "1";
      container.style.transform = "scale(1)";
    });
  }

  function hideWidget() {
    container.style.opacity = "0";
    container.style.transform = "scale(0.95)";
    setTimeout(() => {
      container.style.display = "none";
    }, 200);
  }

  function toggleWidget() {
    if (container.style.display === "none") {
      chrome.storage.local.set({ widgetEnabled: true });
      showWidget();
    } else {
      chrome.storage.local.set({ widgetEnabled: false });
      hideWidget();
    }
  }

  // Auto-show widget if on an active Google Meet room, Zoom session, or WhatsApp Web
  const isMeetRoom = window.location.hostname.includes("meet.google.com") && 
                     /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(window.location.pathname.substring(1));
  const isZoomRoom = window.location.hostname.includes("zoom.us") && window.location.pathname.includes("/j/");
  const isWhatsApp = window.location.hostname.includes("web.whatsapp.com");

  chrome.storage.local.get("widgetEnabled", (data) => {
    const isWidgetEnabled = data.widgetEnabled !== false;
    if (isWidgetEnabled && (isMeetRoom || isZoomRoom || isWhatsApp)) {
      showWidget();
    }
  });

  // Drag and Drop Logic
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  dragHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;
    
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    e.preventDefault();
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    
    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;
    
    const padding = 10;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const rect = container.getBoundingClientRect();
    
    left = Math.max(padding, Math.min(left, viewWidth - rect.width - padding));
    top = Math.max(padding, Math.min(top, viewHeight - rect.height - padding));
    
    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
    container.style.bottom = "auto";
    container.style.right = "auto";
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  // Minimize Control
  let isMinimized = false;
  btnMinimize.addEventListener("click", () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      container.classList.add("voxa-minimized");
      btnMinimize.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
      `;
      btnMinimize.title = "Restore";
    } else {
      container.classList.remove("voxa-minimized");
      btnMinimize.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      `;
      btnMinimize.title = "Minimize";
    }
  });

  // Close Control
  btnClose.addEventListener("click", () => {
    chrome.storage.local.set({ widgetEnabled: false });
    hideWidget();
  });

  // ===============================
  // Control Panel Click Listeners
  // ===============================

  // Handle Microphone Toggle
  btnMic.addEventListener("click", () => {
    if (isRecordingState) {
      // Stopping capture does not require an active user gesture
      chrome.runtime.sendMessage({ type: "STOP_TAB_CAPTURE_REQUEST" });
    } else {
      // Show guide tooltip because starting capture requires activeTab invocation (gesture)
      tooltip.classList.add("voxa-tooltip-visible");
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove("voxa-tooltip-visible");
      }, 3500);
    }
  });

  // Handle Dashboard Click (Open sidebar panel)
  btnDashboard.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_DASHBOARD_REQUEST" });
  });

  // ===============================
  // Runtime Communications
  // ===============================
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Retrieve setting to check if widget is toggled on
    chrome.storage.local.get("widgetEnabled", (data) => {
      const isWidgetEnabled = data.widgetEnabled !== false;

      // Handle toggle widget request from toolbar icon click
      if (message.type === "VOXA_TOGGLE_WIDGET") {
        toggleWidget();
        sendResponse({ status: "success" });
        return;
      }

      // Handle direct show/hide requests from background
      if (message.type === "VOXA_SHOW_WIDGET") {
        chrome.storage.local.set({ widgetEnabled: true });
        showWidget();
        statusText.textContent = "Connected";
        sendResponse({ status: "success" });
        return;
      }
      
      if (message.type === "VOXA_HIDE_WIDGET") {
        hideWidget();
        sendResponse({ status: "success" });
        return;
      }

      // If user closed the widget, do not process transcripts/wave updates
      if (!isWidgetEnabled) {
        sendResponse({ status: "disabled" });
        return;
      }

      // Automatically reveal container for other messages if it is enabled but hidden
      if (container.style.display === "none") {
        showWidget();
      }

      switch (message.type) {
        case "ACTIVETAB_GRANTED":
          tooltip.classList.remove("voxa-tooltip-visible");
          break;

        case "VOXA_TRANSCRIPT":
          if (message.transcript) {
            transcriptBox.innerHTML = `${message.transcript}<span class="voxa-cursor"></span>`;
          } else if (message.isRecording) {
            transcriptBox.innerHTML = `<span class="voxa-placeholder-msg">Listening to speaker...</span>`;
          } else {
            transcriptBox.innerHTML = `<span class="voxa-placeholder-msg">Standby mode...</span>`;
          }

          if (message.translated) {
            translationBox.textContent = message.translated;
          } else if (message.isProcessing) {
            translationBox.innerHTML = `<span class="voxa-placeholder-msg">Translating using NLLB Core...</span>`;
          } else {
            translationBox.innerHTML = `<span class="voxa-placeholder-msg">Waiting for translation...</span>`;
          }
          
          transcriptBox.scrollTop = transcriptBox.scrollHeight;
          translationBox.scrollTop = translationBox.scrollHeight;
          break;

        case "VOXA_WAVE":
          if (message.amplitudes && message.amplitudes.length) {
            waveBarsContainer.classList.add("voxa-wave-active");
            const count = Math.min(message.amplitudes.length, waveBars.length);
            for (let i = 0; i < count; i++) {
              const h = Math.max(3, Math.min(message.amplitudes[i], 16));
              waveBars[i].style.height = `${h}px`;
            }
          } else {
            waveBarsContainer.classList.remove("voxa-wave-active");
            for (let i = 0; i < waveBars.length; i++) {
              waveBars[i].style.height = `3px`;
            }
          }
          break;

        case "VOXA_STATE_CHANGE":
          isRecordingState = message.isRecording;
          
          if (isRecordingState) {
            statusDot.className = "voxa-widget-logo-dot voxa-recording";
            statusText.textContent = "Listening";
            statusText.style.color = "#ff5c5c";
            btnMic.classList.add("voxa-active-mic");
            btnMic.title = "Stop Capture";
          } else if (message.isProcessing) {
            statusDot.className = "voxa-widget-logo-dot";
            statusText.textContent = "Translating...";
            statusText.style.color = "#ffb869";
            btnMic.classList.remove("voxa-active-mic");
            btnMic.title = "Start Capture";
          } else {
            statusDot.className = "voxa-widget-logo-dot";
            statusText.textContent = "Connected";
            statusText.style.color = "#cbc3d7";
            btnMic.classList.remove("voxa-active-mic");
            btnMic.title = "Start Capture";
          }
          break;
      }
      sendResponse({ status: "success" });
    });

    return true; // Keep response channel open for async storage lookup
  });

  console.log("Voxa widget initialized and listening.");
})();
