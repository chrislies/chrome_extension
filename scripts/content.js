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

const allElements = document.getElementsByTagName("*");

if (allElements) {
  for (let i = 0; i < allElements.length; i++) {
    const currElement = allElements[i];
    const bgColor = getComputedStyle(currElement).backgroundColor;
    const textColor = getComputedStyle(currElement).color;
    if (isRGBGreaterThanGray(bgColor)) {
      currElement.style.backgroundColor = rgbToComplement(bgColor);
      currElement.style.color = rgbToComplement(textColor);
    }
  }
}

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
