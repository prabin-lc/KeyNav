chrome.commands.onCommand.addListener(function (command) {
  chrome.tabs.executeScript(
    {
      code: "if(typeof appStatus === 'undefined') {result='undefined'} else {result = appStatus}",
    },
    function (results) {
      switch (results[0]) {
        case "undefined":
          chrome.tabs.executeScript({
            file: "./content-scripts/init.js",
          });
        case "idle":
          chrome.tabs.executeScript({
            file: "./content-scripts/session.js",
          });
          break;
        case "running":
          chrome.tabs.executeScript({
            code: "exit()",
          });
          break;
      }
    }
  );
  // chrome.tabs.query({ active: true }, function (tabs) {
  //   const tab = tabs[0];
  //   console.log(appState);
  //   const appStateInTab = appState[tab.id.toString()];
  //   if (command === "start-session" && appStateInTab !== "running") {
  //     if (appStateInTab === undefined) {
  //       chrome.tabs.executeScript({
  //         file: "./content-scripts/init.js",
  //       });
  //     }
  //     appState[tab.id.toString()] = "running";
  //     function messageListener(message) {
  //       if (message.status === "exit") {
  //         appState[tab.id.toString()] = "idle";
  //         chrome.runtime.onMessage.removeListener(messageListener);
  //       }
  //     }
  //     chrome.runtime.onMessage.addListener(messageListener);
  //     chrome.tabs.executeScript({
  //       file: "./content-scripts/session.js",
  //     });
  //   }
  // });
});
// chrome.runtime.onMessage.addListener(function (message) {});
