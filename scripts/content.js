const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to apply styles
function applyExtensionStyles() {
  console.log("apply");
  const allElements = document.getElementsByTagName("*");
  const bodyElement = document.body;

  // Handle document body background color
  if (bodyElement.style.backgroundColor === "") {
    bodyElement.style.backgroundColor = "rgb(20,20,20)";
    bodyElement.style.color = "white";
  } else if (isRGBGreaterThanGray(bodyElement.style.backgroundColor)) {
    bodyElement.style.backgroundColor = rgbToComplement(
      bodyElement.style.backgroundColor
    );
    bodyElement.style.color = rgbToComplement(bodyElement.style.color);
  }

  if (allElements) {
    for (let i = 0; i < allElements.length; i++) {
      const currElement = allElements[i];
      const bgColor = getComputedStyle(currElement).backgroundColor;
      if (isRGBGreaterThanGray(bgColor)) {
        currElement.style.backgroundColor = rgbToComplement(bgColor);
      }
      currElement.style.color = "white";
    }
  }
}

// Function to remove styles
function removeExtensionStyles() {
  console.log("remove");
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

// Add an event listener for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.enabled !== undefined) {
    // Update the extension behavior based on the toggle switch state
    if (message.enabled) {
      applyExtensionStyles();
    } else {
      removeExtensionStyles();
    }
  }
});

function rgbToComplement(rgb) {
  // Extracting the individual RGB components
  const components = rgb.match(/\d+/g);
  const red = parseInt(components[0]);
  const green = parseInt(components[1]);
  const blue = parseInt(components[2]);

  // Calculating the complement
  const complementRed = 255 - red;
  const complementGreen = 255 - green;
  const complementBlue = 255 - blue;

  // Formatting the result in RGB format
  const complementColor = `rgb(${complementRed}, ${complementGreen}, ${complementBlue})`;

  // console.log(rgb, components, complementColor);
  return complementColor;
}

function isRGBGreaterThanGray(rgb) {
  // Extracting the individual RGB components
  const components = rgb.match(/\d+/g);
  const red = parseInt(components[0]);
  const green = parseInt(components[1]);
  const blue = parseInt(components[2]);

  return red > 100 || green > 100 || blue > 100;
}
