// background.js - Voxa Extension Service Worker Controller

let meetingActive = false;
let meetingTabId = null;
let pendingStreamId = null;

let blinkInterval = null;
let blinkState = false;

// ===============================
// Supported Communication Sites
// ===============================
function isSupportedUrl(url) {
  if (!url) return false;
  return url.includes("meet.google.com") || url.includes("zoom.us") || url.includes("web.whatsapp.com");
}

function startBadgeBlink() {
  if (blinkInterval) return;
  blinkInterval = setInterval(() => {
    blinkState = !blinkState;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id && isSupportedUrl(activeTab.url)) {
        if (blinkState) {
          chrome.action.setBadgeText({ text: "LIVE", tabId: activeTab.id });
          chrome.action.setBadgeBackgroundColor({ color: "#22c55e", tabId: activeTab.id }); // Emerald Green
        } else {
          chrome.action.setBadgeText({ text: "", tabId: activeTab.id });
        }
      }
    });
  }, 800);
}

function stopBadgeBlink() {
  if (blinkInterval) {
    clearInterval(blinkInterval);
    blinkInterval = null;
  }
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.action.setBadgeText({ text: "", tabId: tab.id });
      }
    }
  });
}

// ===============================
// Extension Installed
// ===============================
chrome.runtime.onInstalled.addListener(async () => {
  try {
    // 1. Programmatically set the global path for the sidepanel
    await chrome.sidePanel.setOptions({
      path: "sidepanel/sidepanel.html",
      enabled: true
    });

    // 2. Configure native browser-managed opening on action click (100% reliable)
    await chrome.sidePanel.setPanelBehavior({
      openPanelOnActionClick: true,
    });
    
    // 3. Register context menu item as activeTab invocation context fallback
    chrome.contextMenus.create({
      id: "voxa-activate",
      title: "Activate Voxa Capture",
      contexts: ["all"]
    });

    console.log("✅ Voxa: Global Sidepanel configured.");

    chrome.storage.local.set({
      sourceLang: "auto",
      targetLang: "hin_Deva",
      widgetEnabled: true,
      fontSize: "16px",
      volume: 80,
      theme: "obsidian-flux",
    });
  } catch (err) {
    console.error("SidePanel Error:", err);
  }
});

// ===============================
// Context Menu & Shortcut Capture Trigger
// ===============================
function triggerCaptureForTab(tab) {
  if (!tab || !tab.id) return;
  console.log("Synchronously obtaining MediaStream ID for tab ID:", tab.id);

  // Synchronously call getMediaStreamId under active user gesture context
  chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id }, async (streamId) => {
    if (chrome.runtime.lastError || !streamId) {
      const errorMsg = chrome.runtime.lastError?.message || "Capture request rejected.";
      console.error("Capture invocation failed:", errorMsg);
      chrome.runtime.sendMessage({
        type: "CAPTURE_PERMISSION_DENIED",
        error: errorMsg
      }).catch(() => {});
      return;
    }

    console.log("✅ Tab Capture MediaStream ID generated:", streamId);
    pendingStreamId = streamId;

    // Create the offscreen document
    await createOffscreen();

    // Notify the sidepanel to transition UI to recording state
    chrome.runtime.sendMessage({
      type: "ACTIVETAB_GRANTED",
      tabId: tab.id,
      streamId: streamId
    }).catch(() => {});
  });
}

// Listen for Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "voxa-activate" && tab) {
    triggerCaptureForTab(tab);
  }
});

// Listen for Keyboard Shortcuts (Ctrl+Shift+U)
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "activate-voxa" && tab) {
    triggerCaptureForTab(tab);
  }
});

// ===============================
// Tab Switching & Page Updates
// ===============================
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const activeTab = await chrome.tabs.get(tabId);
    if (!activeTab.url) return;

    // Auto-blink status check
    if (isSupportedUrl(activeTab.url)) {
      startBadgeBlink();
    } else {
      stopBadgeBlink();
    }
  } catch (err) {
    console.log("Tab activate error:", err);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active) {
    if (isSupportedUrl(tab.url)) {
      startBadgeBlink();
    } else {
      stopBadgeBlink();
    }
  }
});

// ===============================
// Runtime Messages
// ===============================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "START_TAB_CAPTURE_REQUEST":
      const streamId = message.streamId;
      if (!streamId) {
        console.error("No streamId received in START_TAB_CAPTURE_REQUEST");
        sendResponse({ success: false, error: "No streamId provided" });
        return false;
      }

      console.log("✅ Tab Capture MediaStream ID received from sidepanel:", streamId);
      pendingStreamId = streamId;

      // Create the offscreen document
      createOffscreen().then(() => {
        sendResponse({ success: true });
      }).catch((err) => {
        sendResponse({ success: false, error: err.message });
      });
      return true; // async response

    case "STOP_TAB_CAPTURE_REQUEST":
      console.log("Stopping Tab Capture...");
      chrome.runtime.sendMessage({ type: "STOP_CAPTURE" });
      closeOffscreen();
      sendResponse({ success: true });
      return false;

    case "OFFSCREEN_READY":
      console.log("✅ Offscreen document ready.");
      if (pendingStreamId) {
        console.log("Streaming MediaStream ID to Offscreen Document...");
        chrome.runtime.sendMessage({
          type: "START_CAPTURE",
          streamId: pendingStreamId,
        });
        pendingStreamId = null; // Consume the pending stream
      }
      break;
  }
  return false;
});

// ===============================
// Offscreen Document Lifecycle
// ===============================
async function createOffscreen() {
  const url = chrome.runtime.getURL("offscreen/offscreen.html");
  
  try {
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [url],
    });
    if (existingContexts.length > 0) {
      console.log("Offscreen document already exists.");
      // Already open; trigger ready message directly
      chrome.runtime.sendMessage({ type: "OFFSCREEN_READY" });
      return;
    }
  } catch (err) {
    // Fallback if getContexts is not supported
  }

  try {
    await chrome.offscreen.createDocument({
      url: "offscreen/offscreen.html",
      reasons: ["USER_MEDIA"],
      justification: "Capture Google Meet audio via tabCapture",
    });
    console.log("Offscreen document created successfully.");
  } catch (err) {
    console.error("Error creating offscreen document:", err);
  }
}

async function closeOffscreen() {
  try {
    await chrome.offscreen.closeDocument();
    console.log("Offscreen document closed.");
  } catch (err) {
    // Already closed or fails silently
  }
}
