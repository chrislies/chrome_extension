// Function to apply styles
function applyExtensionStyles() {
  const bodyElement = document.body;

  // Handle document body background color
  if (bodyElement.style.backgroundColor === "") {
    bodyElement.style.backgroundColor = "rgb(20,20,20)";
    // bodyElement.style.color = "white";
  } else if (isRGBGreaterThanGray(bodyElement.style.backgroundColor)) {
    bodyElement.style.backgroundColor = rgbToComplement(
      bodyElement.style.backgroundColor
    );
    // bodyElement.style.color = rgbToComplement(bodyElement.style.color);
  }
  traverseNodes(document.body);
}

// Function to remove styles
function removeExtensionStyles() {
  const allElements = document.getElementsByTagName("*");
  const bodyElement = document.body;

  // Reset document body styles
  bodyElement.style.backgroundColor = "";
  bodyElement.style.color = "";

  // Reset styles for all elements
  if (allElements) {
    for (let i = 0; i < allElements.length; i++) {
      const currElement = allElements[i];
      currElement.style.backgroundColor = "";
      currElement.style.color = "";
    }
  }
}

function rgbToComplement(rgb) {
  // Extracting the individual RGB components
  const components = rgb ? rgb.match(/\d+/g) : null;

  if (components && components.length >= 3) {
    const red = parseInt(components[0]);
    const green = parseInt(components[1]);
    const blue = parseInt(components[2]);

    if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
      // Calculating the complement
      const complementRed = 255 - red;
      const complementGreen = 255 - green;
      const complementBlue = 255 - blue;

      // Formatting the result in RGB format
      const complementColor = `rgb(${complementRed}, ${complementGreen}, ${complementBlue})`;

      return complementColor;
    }
  }

  // Handle the case when components are not available or invalid
  console.error("Invalid or missing RGB components:", rgb);
  return rgb;
}

function isRGBGreaterThanGray(rgb) {
  // Extracting the individual RGB components
  const components = rgb ? rgb.match(/\d+/g) : null;

  if (components && components.length >= 3) {
    const red = parseInt(components[0]);
    const green = parseInt(components[1]);
    const blue = parseInt(components[2]);

    if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
      return red > 100 || green > 100 || blue > 100;
    }
  }

  // Handle the case when components are not available or invalid
  console.error("Invalid or missing RGB components:", rgb);
  return false;
}

function invertColor(node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    let backgroundColor = getComputedStyle(node).backgroundColor;
    if (isRGBGreaterThanGray(backgroundColor)) {
      node.style.backgroundColor = rgbToComplement(backgroundColor);
    }
    let textColor = getComputedStyle(node).color;
    // Check if the text color is not an empty string
    if (textColor !== "") {
      node.style.color = "white";
      // node.style.color = rgbToComplement(textColor);
    }
  }
  if (node.nodeType === Node.TEXT_NODE) {
    let parentElement = node.parentElement;
    if (parentElement.tagName === "A") {
      parentElement.style.color = "#006493"; // blue
    } else {
      parentElement.style.color = "white";
    }
  }
}

function traverseNodes(node) {
  invertColor(node);
  for (const childNode of node.childNodes) {
    traverseNodes(childNode);
  }
}

const observer = new MutationObserver((mutationsList) => {
  // applyExtensionStyles();
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((addedNode) => {
        traverseNodes(addedNode);
      });
    }
  }
});

observer.observe(document, { childList: true, subtree: true });

// Add an event listener for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.enabled !== undefined) {
    // Update the extension behavior based on the toggle switch state
    updateExtensionState(message.enabled);
  }
});

// Apply or remove styles based on the extension state
function updateExtensionState(isEnabled) {
  if (isEnabled) {
    applyExtensionStyles();
    // Add back the MutationObserver if it was removed
    observer.observe(document, { childList: true, subtree: true });
  } else {
    removeExtensionStyles();
    // Disconnect the MutationObserver to stop further styling
    observer.disconnect();
  }
}

// Add an event listener for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.enabled !== undefined) {
    // Update the extension behavior based on the toggle switch state
    updateExtensionState(message.enabled);
  }
});

applyExtensionStyles();
