// Keep track of the toggle state (initially retrieved from storage)
let toggleState;

// Retrieve the toggle state from storage on startup
chrome.storage.sync.get("toggleState", (data) => {
  toggleState = data.toggleState || false; // Default to false if not found

  // Send the state to the content script if a tab is already open
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      enableExtension(tabs[0].id); // Use your existing function
    }
  });
});

// Function to enable the extension and send a message to content script
function enableExtension(tabId) {
  chrome.tabs.sendMessage(tabId, { enabled: toggleState });
}

// Listen for web navigation events
chrome.webNavigation.onCompleted.addListener(function (details) {
  // Check if the dark theme is enabled, and send a message to content script
  if (toggleState) {
    enableExtension(details.tabId);
  }
});

// Add a listener for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getToggleState") {
    sendResponse({ enabled: toggleState });
  } else if (message.action === "setToggleState") {
    toggleState = message.enabled;
    // Save the new state to storage
    chrome.storage.sync.set({ toggleState: toggleState }, () => {
      console.log("Toggle state saved to storage");
    });

    // Send the updated state to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        enableExtension(tabs[0].id);
      }
    });
  }
});
