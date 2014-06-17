// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

var ports = [];
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name !== "devtools") return;
    ports.push(port);
    port.onDisconnect.addListener(function () {
        var i = ports.indexOf(port);
        if (i !== -1) ports.splice(i, 1);
    });
    port.onMessage.addListener(function (msg) {
        if (msg.tabId) {
          getJsonResource(msg.tabId);
        } else {
          console.log(msg);
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changes, tabObject) {
  if (changes.status == "complete") {
    getJsonResource(tabId);
  }
});

// Function to send a message to main.js
function notifyDevtools(msg) {
    ports.forEach(function (port) {
        port.postMessage(msg);
    });
}

function getJsonResource(tabID) {
  chrome.tabs.get(tabID, function(tab) {
    //Before doing this, we should check if it is a Solidus tab
    var jsonResourceURL = tab.url+".json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", jsonResourceURL, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp = JSON.parse(xhr.responseText);
        notifyDevtools(xhr.responseText);
      }
    }
    xhr.send();
  });
}
