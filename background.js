let currentUule = '';

function loadSavedUule() {
  chrome.storage.sync.get('uule', function(data) {
    if (data.uule) {
      currentUule = data.uule;
      console.log('Loaded saved uule:', currentUule);
    }
  });
}

chrome.runtime.onInstalled.addListener(loadSavedUule);
chrome.runtime.onStartup.addListener(loadSavedUule);

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.uule) {
    currentUule = changes.uule.newValue;
    console.log('Updated uule:', currentUule);
  }
});

chrome.webNavigation.onCommitted.addListener(function(details) {
  if (details.url.includes('https://www.google.com/search')) {
    console.log('Detected Google search page, sending message to content script');
    chrome.tabs.sendMessage(details.tabId, {
      action: "checkAndUpdateUule",
      uule: currentUule
    }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError);
      } else if (response) {
        console.log('Received response from content script:', response);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getUule") {
    console.log('Received getUule request, sending:', currentUule);
    sendResponse({uule: currentUule});
  }
});