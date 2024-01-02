let isExtensionEnabled = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggleExtension) {
    isExtensionEnabled = !isExtensionEnabled;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          const allElements = document.getElementsByTagName("*");
          for (let i = 0; i < allElements.length; i++) {
            const currElement = allElements[i];
            const bgColor = getComputedStyle(currElement).backgroundColor;
            if (bgColor && bgColor !== "transparent") {
              currElement.style.backgroundColor = isExtensionEnabled
                ? "rgba(28, 27, 27, 0.88)"
                : bgColor;
              currElement.style.color = isExtensionEnabled ? "white" : "black";
            }
          }
        },
      });
    });
  }
});
