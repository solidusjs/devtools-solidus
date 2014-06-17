// This runs in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*

//I think the inspector var needs to be global and just updated here
function sendJsonToInspector(msg) {
    if(!inspector) {
        var inspector = new InspectorJSON({
          element: 'pagecontext',
          json: '{"hello":"world"}'
      });
    }
    inspector.view(msg);
}
