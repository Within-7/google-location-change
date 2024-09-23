chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("google.com/search")) {
    chrome.tabs.sendMessage(tab.id, {action: "addUuleParameter"});
  }
});