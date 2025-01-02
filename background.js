// background.js: This file handles the background functionality of the Chrome extension, 
// specifically listening for the browser action click event and executing the content script.

// This event listener is triggered when the browser action (extension icon) is clicked.
chrome.action.onClicked.addListener((tab) => {
  // Injects the content script into the active tab
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["content.js"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed: ", chrome.runtime.lastError.message);
      }
    }
  );
});
