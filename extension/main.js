// Runs in the context of DevTools including devpanel.js
// Can use
// chrome.devtools.*
// chrome.extension.*

chrome.devtools.panels.create('Solidus', 'icon-128.png', 'devpanel.html',
function(panel){

  var _window;
  var data = [];
  var port = chrome.runtime.connect({name: 'devtools'});

  port.onMessage.addListener(function(msg) {
    // Send message to devpanel, or queue message if panel isn't shown
    if (_window) {
      _window.processMainIncomingMessage(msg);
    } else {
      data.push(msg);
    }
  });

  panel.onShown.addListener(function tmp(panelWindow) {
    _window = panelWindow;

    //Send messages that were queued before panel was shown
    var msg;
    while (msg === data) {
      msg = data.shift();
      _window.processMainIncomingMessage(msg);
    }
    _window.respond = function(msg) {
      port.postMessage(msg);
    };

    //Tell background.js which tab is being inspected
    _window.respond(chrome.devtools.inspectedWindow);
  });
});
