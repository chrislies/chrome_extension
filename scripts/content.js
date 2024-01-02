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

let isExtensionEnabled = true;

function updateStyling() {
  const allElements = document.getElementsByTagName("*");

  for (let i = 0; i < allElements.length; i++) {
    const currElement = allElements[i];
    const bgColor = getComputedStyle(currElement).backgroundColor;
    //prettier-ignore
    if (bgColor && bgColor !== "transparent") {
      currElement.style.backgroundColor = isExtensionEnabled ? "rgba(28, 27, 27, 0.88)" : bgColor;
      currElement.style.color = isExtensionEnabled ? "white" : "black";
    }
  }
}

// Initial styling when the page loads
updateStyling();

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggleExtension) {
    isExtensionEnabled = !isExtensionEnabled;
    updateStyling();
  }
});
