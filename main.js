// Can use
// chrome.devtools.*
// chrome.extension.*

chrome.devtools.panels.create("Solidus", "solidus.png", "views/devpanel.html",
function(panel){

    var _window;
    var data = [];
    var port = chrome.runtime.connect({name: 'devtools'});

    port.onMessage.addListener(function(msg) {
      // Send message to devpanel, if it exists.
      // If there is no panel yet, queue messages for later.
      if (_window) {
        _window.sendJsonToInspector(msg);
      } else {
        data.push(msg);
      }
    });

    panel.onShown.addListener(function tmp(panelWindow) {
      panel.onShown.removeListener(tmp); // Only run first time
      _window = panelWindow;

      var msg;
      while (msg = data.shift())
      _window.sendJsonToInspector(msg);
      _window.respond = function(msg) {
        port.postMessage(msg);
      };

      panelWindow.respond(chrome.devtools.inspectedWindow);
    });
});
