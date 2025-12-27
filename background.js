// Background service worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('Instagram Pro extension installed');
});

// Handle messages if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Background script can handle cross-tab communication if needed
  return true;
});
