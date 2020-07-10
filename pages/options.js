const defaultSettings = {
  scrollBehaviour: "smooth",
  scrollHeight: 200,
  scrollWidth: 200,
  scrollUpKey: "j",
  scrollDownKey: "k",
  clickStartKey: "f",
  traverseKeys: ["h", "g", "c"],
  selectors: ["button", "a"],
};

let customSettings = {
  scrollBehaviour: "smooth",
  scrollHeight: 200,
  scrollWidth: 200,
  scrollUpKey: "j",
  scrollDownKey: "k",
  clickStartKey: "f",
  traverseKeys: ["h", "g", "c"],
  selectors: ["button", "a"],
};

document.querySelector("div>form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  for (i in customSettings) {
    if (Array.isArray(customSettings[i])) customSettings[i] = formData.getAll(i);
    else customSettings[i] = formData.get(i);
  }
  chrome.storage.local.set(customSettings, function (error) {
    if (error) alert(error.message);
    else alert("Saved.");
  });
});

document.querySelector("button#restore").addEventListener("click", function () {
  chrome.storage.local.set(defaultSettings, function (error) {
    if (error) alert(error.message);
    else {
      alert("Restored to defaults.");
      window.location.reload();
    }
  });
});

function duplicateAndInsert(tag) {
  const dup = tag.cloneNode();
  tag.insertAdjacentElement("afterend", dup);
  return dup;
}

function validateSettings(settings) {
  switch (settings.scrollBehaviour) {
    case "auto":
      break;
    case "smooth":
      break;
    default:
      throw Error("Unknown scroll behaviour");
  }
  if (typeof settings.scrollHeight !== "number" || settings.scrollHeight < 1) throw Error("Invalid scroll height");
  if (typeof settings.scrollWidth !== "number" || settings.scrollWidth < 1) throw Error("Invalid scroll width");
}

function displaySettings(settings) {
  try {
    validateSettings(settings);
    document.getElementById(`scroll${settings.scrollBehaviour}`).checked = true;
    document.getElementById("scrollHeight").value = settings.scrollHeight;
    document.getElementById("scrollWidth").value = settings.scrollWidth;
    document.getElementById("scrollUpKey").value = settings.scrollUpKey;
    document.getElementById("scrollDownKey").value = settings.scrollDownKey;
    document.getElementById("clickStartKey").value = settings.clickStartKey;
    let traverseKeyStartInput = document.getElementById("traverseKey");
    while (traverseKeyStartInput.nextElementSibling.tagName !== "BUTTON") traverseKeyStartInput.nextElementSibling.remove();
    const tempTraverseKeys = [...settings.traverseKeys];
    traverseKeyStartInput.value = tempTraverseKeys.shift();
    tempTraverseKeys.forEach((key) => {
      traverseKeyStartInput = duplicateAndInsert(traverseKeyStartInput);
      traverseKeyStartInput.value = key;
    });
    let selectorStartInput = document.getElementById("selector");
    while (selectorStartInput.nextElementSibling.tagName !== "BUTTON") selectorStartInput.nextElementSibling.remove();
    const tempSelectors = [...settings.selectors];
    selectorStartInput.value = tempSelectors.shift();
    tempSelectors.forEach((key) => {
      selectorStartInput = duplicateAndInsert(selectorStartInput);
      selectorStartInput.value = key;
    });
  } catch (error) {
    alert(error.message);
  }
}

function addInput() {
  duplicateAndInsert(this.previousElementSibling);
}
function deleteInput() {
  this.previousElementSibling.previousElementSibling.remove();
}

chrome.storage.local.get(null, function (data) {
  if (data) {
    customSettings = data;
    customSettings.scrollHeight = parseInt(customSettings.scrollHeight);
    customSettings.scrollWidth = parseInt(customSettings.scrollWidth);
  }
  displaySettings(customSettings);
});

document.querySelectorAll("button.addInput").forEach((btn) => btn.addEventListener("click", addInput));
document.querySelectorAll("button.deleteInput").forEach((btn) => btn.addEventListener("click", deleteInput));
displaySettings(defaultSettings);
