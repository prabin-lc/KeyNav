let appState = "not started";
chrome.commands.onCommand.addListener(function (command) {
  if (command === "start-session" && appState !== "running") {
    if (appState === "not started") {
      chrome.tabs.executeScript({
        file: "./content-scripts/init.js",
      });
    }
    appState === "running";
    chrome.tabs.executeScript({
      file: "./content-scripts/session.js",
    });
  }
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message.status === "exit") appState = "idle";
});
