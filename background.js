chrome.commands.onCommand.addListener(function (command) {
  if(command === "start-session")
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
});
