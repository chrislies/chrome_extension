// Keep track of the toggle state
let toggleState = false;

// Add a listener for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getToggleState") {
    sendResponse({ enabled: toggleState });
  } else if (message.action === "setToggleState") {
    toggleState = message.enabled;
  }
});

// Listen for web navigation events
chrome.webNavigation.onCompleted.addListener(function (details) {
  // Check if the dark theme is enabled, and send a message to content script
  if (toggleState) {
    chrome.tabs.sendMessage(details.tabId, { enabled: true });
  }
});
