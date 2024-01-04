let toggleState = false;

// Add a listener for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getToggleState") {
    sendResponse({ enabled: toggleState });
  } else if (message.action === "setToggleState") {
    toggleState = message.enabled;
  }
});
