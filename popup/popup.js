document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");

  // Send a message to background.js to get the current state
  chrome.runtime.sendMessage({ action: "getToggleState" }, function (response) {
    toggleSwitch.checked = response.enabled || false;
    updateExtensionState(toggleSwitch.checked);
  });

  // Add a listener for the toggle switch change event
  toggleSwitch.addEventListener("change", function () {
    const isEnabled = toggleSwitch.checked;

    // Save the current state to storage by sending a message to background.js
    chrome.runtime.sendMessage({
      action: "setToggleState",
      enabled: isEnabled,
    });

    // Update the extension state based on the toggle switch
    updateExtensionState(isEnabled);
  });
});

function updateExtensionState(isEnabled) {
  // Communicate with the content script to enable/disable the extension
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { enabled: isEnabled });
  });
}
