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
  }
});

// Function to send a message to main.js
function notifyDevtools(msgType, msg) {
  var packagedMessage = {};
  packagedMessage.msgType = msgType;
  packagedMessage.msg = msg;
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
      var isSolidus, errMsg;
      isSolidus = (xhr.getResponseHeader('X-Powered-By').match(/Solidus/i));
      notifyDevtools('info', xhr.getResponseHeader('X-Powered-By'));
      if (xhr.readyState === 4 && isSolidus) { // Is complete Solidus response?
        if(xhr.status !== 200){ // Check that Solidus response didn't fail
          errMsg = 'Failed to get Solidus context. Status: ' + xhr.status;
          notifyDevtools('error', errMsg);
        } else {
          try {
            // Send Solidus JSON to devpanel
            notifyDevtools('context', JSON.parse(xhr.responseText));
          } catch  (e) {
            notifyDevtools('error', e);
          }
        }
      } else {
        errMsg = 'Looks like you\'re not inspecting a Solidus Page.';
        notifyDevtools('error', errMsg);
      }
    };
    xhr.send();
  });
}
