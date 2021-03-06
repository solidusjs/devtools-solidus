// Runs in the context of the DevTools panel
// Can use
// chrome.devtools.*
// chrome.extension.*

// Tell JSHint that processMainIncomingMessage is definedhere but used elsewhere
/* exported processMainIncomingMessage */
// Tell JSHint about the socket.io global
/* global io, $ */

var inspector;

if (typeof io !== 'undefined') {
  var socket = io('http://localhost:8081');
  socket.on('connect', function(){
    socket.on('log', function(data){
      addToLog(data.message);
      });
    socket.on('disconnect', function(){
      document.getElementById('serverlogs').innerHTML = 'Socket Disconnected';
      });
  });
}

function processMainIncomingMessage(msg) {
  switch(msg.msgType) {
    case 'context':
      setupInspector(msg.payload);
      break;
    case 'error':
      showAlert(msg.payload, 'Error:', 'danger');
      break;
    case 'status':
      updateStatus(msg.payload);
      break;
    case 'action':

      switch (msg.payload) {
        case 'shutdown':
          destroyInspector();
          $('#panelTabs a[href="#info"]').tab('show');
          $('#panelTabs a[href="#context"]').attr('data-toggle', 'none');
          $('#panelTabs a[href="#logs"]').attr('data-toggle', 'none');
          break;
        case 'soft-shutdown':
          destroyInspector();
          $('#panelTabs a[href="#info"]').tab('show');
          $('#panelTabs a[href="#context"]').attr('data-toggle', 'none');
          break;
        case 'reload':
          clearAlerts();
          $('#panelTabs a[href="#context"]').attr('data-toggle', 'tab');
          $('#panelTabs a[href="#logs"]').attr('data-toggle', 'tab');
          break;
        default:
      }

      break;
    default:
      console.log('Unhandled Message', msg);
  }
}

function setupInspector(context) {
  if ((inspector instanceof InspectorJSON)) {
    destroyInspector();
  }
  inspector = new InspectorJSON({
    element: 'pagecontext',
    url: (context.url.hostname + context.url.path),
    json: context
  });
}

function destroyInspector() {
  if (inspector instanceof InspectorJSON) {
    inspector.destroy();
    inspector = {}; // inspector.destroy() doesn't completely reset the object
  }
}

function createAlert(info, label, alertClass) { //Create a Bootstrap HTML alert
  var infoClass = alertClass?alertClass:'info';
  var infoLabel = label?'<strong>' + label +'</strong> ':'';
  return '<div class="alert alert-' + infoClass +
  ' alert-dismissible" role="alert"><button type="button" class="close"' +
  ' data-dismiss="alert"><span aria-hidden="true">&times;</span>' +
  '<span class="sr-only">Close</span></button>' + infoLabel + info + '</div>';
}

function showAlert(message, label, alertClass){ //Show an alert
  var theAlert = createAlert(message, label, alertClass);
  document.getElementById('messageholder').innerHTML += theAlert;
}

function clearAlerts(){
  document.getElementById('messageholder').innerHTML = '';
}

function updateStatus(status) { //Update status panel in footer
  document.getElementById('pluginstatus').innerHTML = status;
}

function addToLog(msg) {
  if (document.getElementById('serverlogs')) {
    var logContainer = document.getElementById('serverlogs');
    logContainer.innerHTML += msg + '\n';
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}

function clearLog() {
  document.getElementById('serverlogs').innerHTML = '';
}

window.addEventListener('load', function() {
  if (document.getElementById('logclear')) {
    var clearButton = document.getElementById('logclear');
    clearButton.addEventListener('click', clearLog, false);
  }
  if (document.getElementById('sidePanel')) {
    $('#sidePanel').resizable({ minWidth: 120, handles: 'e'});
  }
}, false);
