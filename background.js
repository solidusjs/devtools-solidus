// Chrome automatically creates a background.html page as the context for this
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
        console.log("Background.js Recieved Message", msg);
        processBackgroundIncomingMessage(msg);
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changes, tabObject) {
  if (changes.status == "complete") {
    getJsonResource(tabId);
  }
});

function processBackgroundIncomingMessage(msg) {
  console.log("Processing Message in Background", msg)
  if (msg.tabId) {
    getJsonResource(msg.tabId);
  } else {
    console.log(msg);
  }
}

// Function to send a message to main.js
function notifyDevtools(msg) {
    console.log("Background.js Sending Message", msg);
    ports.forEach(function (port) {
        port.postMessage(msg);
    });
}

function getJsonResource(tabID) {
  var pageContext;
  chrome.tabs.get(tabID, function(tab) {
    var jsonResourceURL = tab.url+".json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", jsonResourceURL, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4){
        if(xhr.status === 200){
          try {
            pageContext = JSON.parse(xhr.responseText);
            notifyDevtools(pageContext);
          } catch  (e) {
            notifyDevtools(JSON.parse('{"error":"' + e + '"}'));
          }
        } else {
          notifyDevtools(JSON.parse('{"error":"No Solidus Page Context Found"}'));
        }
      }
    }
    xhr.send();
  });
}
