chrome.action.onClicked.addListener(() => {
  chrome.runtime.sendMessage({ toggleExtension: true });
});
