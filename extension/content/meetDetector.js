// meetDetector.js - Voxa Google Meet Detector

console.log("✅ Voxa Meet Detector Loaded");

// Notify background that Meet page is loaded
chrome.runtime.sendMessage({
  type: "MEET_DETECTED",
});

// Track previous meeting state
let previousMeetingState = null;

/**
 * Detect whether user has actually joined a meeting room
 */
function isMeetingJoined() {
  // 1. Validate hostname
  if (!window.location.hostname.includes("meet.google.com")) {
    return false;
  }

  // 2. Validate URL path represents a meeting room (e.g. /abc-defg-hij)
  const path = window.location.pathname.substring(1);
  const isMeetingUrl = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(path);
  if (!isMeetingUrl) {
    return false;
  }

  // 3. If join buttons exist, the user is still in the lobby/pre-join screen
  const joinButton =
    document.querySelector('[data-mdc-dialog-action="join"]') ||
    document.querySelector('[aria-label*="Join"]') ||
    document.querySelector('[aria-label*="Ask to join"]');

  if (joinButton) {
    return false;
  }

  return true;
}

/**
 * Send status only when it changes
 */
function updateMeetingStatus() {
  const joined = isMeetingJoined();

  if (joined === previousMeetingState) {
    return;
  }

  previousMeetingState = joined;

  console.log(joined ? "🟢 Meeting Joined" : "🔴 Meeting Left / Lobby");

  chrome.runtime.sendMessage({
    type: "MEETING_STATUS",
    joined,
    url: window.location.href,
  });
}

// Initial check
updateMeetingStatus();

// Keep watching for room entries/exits
setInterval(updateMeetingStatus, 1500);
