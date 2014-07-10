// Runs in the context of the DevTools panel
// Can use
// chrome.devtools.*
// chrome.extension.*

// Tell JSHint that processMainIncomingMessage is definedhere but used elsewhere
/* exported processMainIncomingMessage */
// Tell JSHint about the socket.io global
/* global io */

var inspector;

function processMainIncomingMessage(msg) {
  switch(msg.msgType) {
    case 'context':
      setupInspector(msg.msg);
      break;
    case 'error':
      destroyInspector();
      showAlert(msg.msg, 'Error:');
      //activateTab('info');
      break;
    case 'status':
      updateStatus(msg.msg);
      break;
    default:
      console.log('Unhandled Message', msg);
  }
}

function setupInspector(context) {
  if ((inspector instanceof InspectorJSON) && (inspector.page)) {
    inspector.view(context);
  } else {
    inspector = new InspectorJSON({
      element: 'pagecontext',
      url: context.url.path,
      json: context
    });
  }
}

function destroyInspector() {
  if (inspector instanceof InspectorJSON) {
    inspector.destroy();
  }
}

function createAlert(info, label, alertClass) { //Create a Bootstrap HTML alert
  var infoClass = alertClass?alertClass:'alert-info';
  var infoLabel = label?'<strong>' + label +'</strong> ':'';
  return '<div class="alert ' + infoClass +
  ' alert-dismissible" role="alert"><button type="button" class="close"' +
  ' data-dismiss="alert"><span aria-hidden="true">&times;</span>' +
  '<span class="sr-only">Close</span></button>' + infoLabel + info + '</div>';
}

function showAlert(message, label, alertClass){ //Show an alert
  var theAlert = createAlert(message, label, alertClass);
  document.querySelector('#messageholder').innerHTML += theAlert;
}

function updateStatus(status) { //Update status panel in footer
  document.querySelector('#pluginstatus').innerHTML = status;
}

var socket = io('http://localhost:8081');
socket.on('connect', function(){
  socket.on('log', function(data){
    var logContainer = document.querySelector('#serverlogs');
    logContainer.innerHTML += data.message + '\n';
    logContainer.scrollTop = logContainer.scrollHeight;
    });
  socket.on('disconnect', function(){
    document.querySelector('#serverlogs').innerHTML = 'Socket Disconnected';
    });
});

function clearLog() {
  document.querySelector('#serverlogs').innerHTML = '';
}

window.onload = function() {
  var clearButton = document.querySelector('#logclear');
  clearButton.addEventListener('click', clearLog, false);
};
