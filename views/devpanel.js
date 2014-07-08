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
  console.log('Devpanel Processing Message', msg);
  if (msg.hasOwnProperty('page')) {
    displayMessage('Looks like a Solidus page!');
    //Check if there is an initialized InspectorJSON that hasn't been destroyed
    if ((inspector instanceof InspectorJSON) && (inspector.page)) {
      inspector.view(msg);
    } else {
      inspector = new InspectorJSON({
        element: 'pagecontext',
        url: msg.url.path,
        json: msg
      });
    }
  } else if (msg.hasOwnProperty('error')) {
    if (inspector instanceof InspectorJSON) {
      inspector.destroy();
    }
    displayMessage(msg.error);
  } else {
    console.log('Message Not Processed', msg);
  }
}

function displayMessage(msg) {
  document.querySelector('#messageholder').innerHTML = msg;
  console.log('Updated Panel With Message', msg);
}

var socket = io('http://localhost:8081');
socket.on('connect', function(){
  socket.on('log', function(data){
    document.querySelector('#serverlogs').innerHTML += data.message + '\n';
    });
  socket.on('disconnect', function(){
    document.querySelector('#serverlogs').innerHTML = 'Socket Disconnected';
    });
});
