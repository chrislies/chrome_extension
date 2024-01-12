// Function to apply styles
// prettier-ignore
function applyExtensionStyles() {
  const bodyElement = document.body;

  // Handle document body background color
  if (bodyElement.style.backgroundColor === "") {
    bodyElement.style.backgroundColor = "rgba(20,20,20,1)";
    // bodyElement.style.color = "white";
  } else if (isRGBGreaterThanGray(bodyElement.style.backgroundColor)) {
    bodyElement.style.backgroundColor = rgbToComplement(bodyElement.style.backgroundColor);
  }
  traverseNodes(document.body);
}

// Function to remove styles
function removeExtensionStyles() {
  const allElements = document.getElementsByTagName("*");
  const bodyElement = document.body;

  // Reset document body styles
  bodyElement.style.backgroundColor = "";
  // bodyElement.style.color = "";

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

    let alpha = 1; // Default alpha value if not provided

    if (components.length >= 4) {
      alpha = parseFloat(components[3]);
    }

    if (!isNaN(red) && !isNaN(green) && !isNaN(blue) && !isNaN(alpha)) {
      // Calculate the complement
      const complementRed = 255 - red;
      const complementGreen = 255 - green;
      const complementBlue = 255 - blue;

      // Formatting the result in RGBA format
      const complementColor = `rgba(${complementRed}, ${complementGreen}, ${complementBlue}, ${alpha})`;

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

const isHexColor = (color) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
const isRGBorRGBA = (color) =>
  /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*\d*\.?\d+\s*)?\)$/.test(color);

// prettier-ignore
function hexToRgba(hex) {
  // If the hex color has 3 characters, expand it to 6 characters
  const fullHex = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;

  const r = parseInt(fullHex.slice(1, 3), 16);
  const g = parseInt(fullHex.slice(3, 5), 16);
  const b = parseInt(fullHex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, 1)`;
}

// prettier-ignore
function invertColor(node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    let backgroundColor = getComputedStyle(node).backgroundColor;
    if (backgroundColor === "") {
    } else if (isRGBGreaterThanGray(backgroundColor)) {
      node.setAttribute(
        "style",
        `${node.getAttribute("style") !== null ? `${node.getAttribute("style")} ` : ""}background-color: ${rgbToComplement(backgroundColor)} !important;`
      );
    }
    let textColor = getComputedStyle(node).color;
    // Check if the text color is not an empty string
    if (textColor && !isRGBGreaterThanGray(textColor)) {
      node.style.color = "white";
    } else if (!isHexColor(textColor) && !isRGBorRGBA(textColor)) {
      // text color is in another format:
      node.style.color = "white";
    }
  }
  if (node.nodeType === Node.TEXT_NODE) {
    let parentElement = node.parentElement;
    let textColor = getComputedStyle(parentElement).color;
    // If element's text color is is in hex format, convert it to rgba
    if (isHexColor(textColor)) {
      textColor = hexToRgba(textColor);
    }

    if (parentElement.tagName === "A") {
      parentElement.style.color = "#006493"; // blue
    } else if (!isRGBGreaterThanGray(textColor)) {
      parentElement.style.color = rgbToComplement(textColor);
    } else {
      // parentElement.style.color = "white";
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
    // console.log("apply");
    applyExtensionStyles();
    // Add back the MutationObserver if it was removed
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    // console.log("remove");
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

if (document.querySelector("#toggleSwitch").checked) {
  applyExtensionStyles();
  observer.observe(document.body, { childList: true, subtree: true });
}
