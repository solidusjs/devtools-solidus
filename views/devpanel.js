// Runs in the context of the DevTools panel
//
// Can use
// chrome.devtools.*
// chrome.extension.*

var inspector;

function processMainIncomingMessage(msg) {
  console.log("Devpanel Processing Message", msg);
  if (msg.hasOwnProperty('page')) {
    displayMessage("Looks like a Solidus page!");
    //Check if there is an initialized InspectorJSON that hasn't been destroyed
    if ((inspector instanceof InspectorJSON) && (inspector.page)) {
      inspector.view(msg);
    }
    else {
      inspector = new InspectorJSON({
        element: 'pagecontext',
        json: msg
      });
    }
  } else if (msg.hasOwnProperty('error')) {
    if (inspector instanceof InspectorJSON) {
      inspector.destroy();
    }
    displayMessage(msg.error);
  } else {
    console.log("Message Not Processed", msg);
  }
}

function displayMessage(msg) {
  document.querySelector('#messageholder').innerHTML = msg;
  console.log("Updated Panel With Message", msg);
}
