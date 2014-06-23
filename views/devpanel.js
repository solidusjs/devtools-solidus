// Runs in the context of the DevTools panel
//
// Can use
// chrome.devtools.*
// chrome.extension.*

function processMainIncomingMessage(msg) {
  console.log("Devpanel Processing Message", msg);
  var msgJson = 0;
  try {
    msgJson = JSON.parse(msg); //This doesn't work if it's not a JSON string
  } catch  (e) {
    console.log("Ooops, the message wasnt a JSON string");
  }
 if (msgJson.hasOwnProperty('page')) {
    console.log("Message contains page object!");
    updateInspectorJSON(msg);
  } else if (msg === "Bad Response") {
    displayMessage("This isnt what we need");
  } else {
    console.log("Ooops!", msg.page);
  }
}

function updateInspectorJSON(msg) {
    if(!inspector) {
        var inspector = new InspectorJSON({
          element: 'pagecontext',
          json: '{"hello":"world"}'
      });
    }
    inspector.view(msg);
}

function displayMessage(msg) {
  document.querySelector('#messageholder').innerHTML = msg;
  console.log("Updated Panel With Message", msg);
}
