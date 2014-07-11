// Chrome automatically creates a background.html page as the context for this
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

var tabInspected;
var ports = [];
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== 'devtools') return;
  ports.push(port);
  port.onDisconnect.addListener(function () {
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });
  port.onMessage.addListener(function (msg) {
    if (msg.tabId) {
      tabInspected = msg.tabId;
      getJsonResource(tabInspected);
    } else {
      console.log(msg);
    }
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changes) {
  if (tabId === tabInspected && changes.status === 'complete') {
    getJsonResource(tabId);
    notifyDevtools('action', 'reload');
  }
});

// Function to send a message to main.js
function notifyDevtools(msgType, payload) {
  var packagedMessage = {};
  packagedMessage.msgType = msgType;
  packagedMessage.payload = payload;
  ports.forEach(function (port) {
    port.postMessage(packagedMessage);
  });
}

function getJsonResource(tabID) {
  chrome.tabs.get(tabID, function(tab) {
    var jsonResourceURL = tab.url+'.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', jsonResourceURL, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return; //quickly return if not complete request
      var xpbHeader = xhr.getResponseHeader('X-Powered-By') || 'unknown';
      if (!xpbHeader.match(/Solidus/i)) { //quickly return if not solidus
        notifyDevtools('error', 'No Solidus header detected.');
        notifyDevtools('status', '<b>not</b> running Solidus 0.1.7 or greater');
        notifyDevtools('action', 'shutdown');
        return;
      }
      notifyDevtools('status', 'running ' + xpbHeader);
      if (xhr.status !== 200) {
        notifyDevtools('error', 'Solidus JSON status: ' + xhr.status);
        notifyDevtools('action', 'soft-shutdown');
        return;
      }
      if (xhr.status === 200) {
        try {
          notifyDevtools('context', JSON.parse(xhr.responseText));
          notifyDevtools('action', 'reload');
        } catch  (e) {
          notifyDevtools('error', e);
        }
      } else {
        notifyDevtools('status', 'what' + xhr.status);
      }
    };
    xhr.send();
  });
}
