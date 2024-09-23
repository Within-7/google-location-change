function updateUuleParameter(uule) {
  let url = new URL(window.location.href);
  if (uule && !url.searchParams.has('uule')) {
    let encodedUule = encodeURIComponent(uule).replace(/%2B/g, "+");
    url.searchParams.set('uule', encodedUule);
    console.log('Updating URL with uule:', encodedUule);
    window.history.replaceState({}, '', url.toString().replace(/uule=w%2B/g, "uule=w+"));
    window.location.reload();
    console.log('URL updated:', window.location.href);
  }
}

function checkAndUpdateUule() {
  console.log('Checking and updating uule');
  chrome.runtime.sendMessage({action: "getUule"}, function(response) {
    if (chrome.runtime.lastError) {
      console.error('Error getting uule:', chrome.runtime.lastError);
    } else if (response && response.uule) {
      console.log('Received uule:', response.uule);
      updateUuleParameter(response.uule);
    } else {
      console.log('No uule received');
    }
  });
}

// 在页面加载时检查并添加 uule 参数
if (window.location.href.includes('google.com/search')) {
  console.log('Google search page detected, checking uule');
  checkAndUpdateUule();
}

// 监听来自 background script 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Received message:', request);
  if (request.action === "checkAndUpdateUule") {
    updateUuleParameter(request.uule);
    sendResponse({status: 'uule updated'});
  }
});

// 监听 URL 变化
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('URL changed:', url);
    if (url.includes('google.com/search')) {
      checkAndUpdateUule();
    }
  }
}).observe(document, {subtree: true, childList: true});

console.log('Content script loaded');