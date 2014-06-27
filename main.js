// Runs in the context of DevTools including devpanel.js
// Can use
// chrome.devtools.*
// chrome.extension.*

chrome.devtools.panels.create('Solidus', 'solidus.png', 'views/devpanel.html',
function(panel){

  var _window;
  var data = [];
  var port = chrome.runtime.connect({name: 'devtools'});

  port.onMessage.addListener(function(msg) {

    console.log('Main.js Recieved Message', msg);
    // Send message to devpanel, if it exists.
    // If there is no panel yet, queue messages for later.
    if (_window) {
      _window.processMainIncomingMessage(msg);
    } else {
      data.push(msg);
    }
  });

  panel.onShown.addListener(function tmp(panelWindow) {
    panel.onShown.removeListener(tmp); // Only run first time
    _window = panelWindow;

    var msg;
    while (msg === data) {
      msg = data.shift();
      _window.processMainIncomingMessage(msg);
    }
    _window.respond = function(msg) {
      console.log('Main.js Sending Message', msg);
      port.postMessage(msg);
    };

    //Tell background.js which tab is being inspected
    panelWindow.respond(chrome.devtools.inspectedWindow);
  });
});
