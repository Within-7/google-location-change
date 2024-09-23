chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "addUuleParameter") {
    let url = new URL(window.location.href);
    if (request.uule) {
      console.log(request.uule)
      // url.searchParams.set('uule', request.uule.replace(/%2B/g, "+"));
      window.location.href = url.toString()+'&uule='+request.uule;
    } else {
      url.searchParams.delete('uule');
      window.location.href = url.toString();
    }
  }
});