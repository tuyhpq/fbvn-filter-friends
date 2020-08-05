chrome.browserAction.onClicked.addListener(function() {
  chrome.runtime.openOptionsPage();
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === "origin") {
        header.value = "https://www.facebook.com";
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://www.facebook.com/*"] },
  ["blocking", "requestHeaders", "extraHeaders"]
);
