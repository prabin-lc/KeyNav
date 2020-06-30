const SCROLL_DOWN = "j";
const SCROLL_UP = "k";
const HOVER = "a";
const CLICK = "c";
const NAV_BUTTONS = ["h", "g", "f"];

function keyPressListener(e) {
  keyBuffer.push(e.key);
}

function start() {
  document.body.addEventListener("keypress", keyPressListener);
  console.log("session started");
}

function exit() {
  document.body.removeEventListener("keypress", keyPressListener);
  chrome.runtime.sendMessage({ status: "exit" });
  console.log("session ended");
}

function Node(
  /**
   * the job to perform when user hits this node
   * must contain a cleanup for root nodes */

  job,
  children
) {
  this.job = job;
  this.children = children;
}

Node.prototype.constructor = Node;
Node.prototype.getChild = function (input) {
  // todo
};
Node.prototype.getLeaves = function () {
  // todo
};

const SCROLL_DOWN_NODE = new Node(function () {
  // scroll down
});

const SCROLL_UP_NODE = new Node(function () {
  // scroll up
});

const HOVER_NODE = new Node(function () {
  // generate child nodes
  // change display to override elements
});

const CLICK_NODE = new Node(function () {
  // generate child nodes
  // change display to override elements
});

const MAIN_NODES = [SCROLL_DOWN_NODE, SCROLL_UP_NODE, HOVER_NODE, CLICK_NODE];

SCROLL_DOWN_NODE.children = MAIN_NODES;
SCROLL_UP_NODE.children = MAIN_NODES;
HOVER_NODE.children = MAIN_NODES;
CLICK_NODE.children = MAIN_NODES;

const ROOT_NODE = new Node(undefined, MAIN_NODES);
let currentNode = ROOT_NODE;
