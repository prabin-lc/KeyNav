const SCROLL_DOWN = "j";
const SCROLL_UP = "k";
const HOVER = "a";
const CLICK = "c";
const NAV_KEYS = ["h", "g", "f"];

function Node(
  /**
   * the job to perform when user hits this node
   */

  job,
  /**
   * an array with fixed indexes and keys mapping
   */
  children
) {
  this.job = job;
  this.children = children;
}

Node.prototype.constructor = Node;
Node.prototype.gotoChild = function (input) {
  /**
   * goes to a child wrt to the input and also performs the job
   * if no child was found for the input then cleanup and exit
   */
};
Node.prototype.getLeaves = function () {
  /**
   * get leaf nodes (except the main nodes because of recurssion) with their paths
   */
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

function generateGraph(elements, isHover = true) {
  /**
   * generate linked graph for the captured html elements
   * jobs must click or hover the element according to the parameter provided
   */
}

function keyPressListener(e) {
  /**handles key press
   * mainly calls gotoChild of current node
   */
  keyBuffer.push(e.key);
}

function start() {
  document.body.addEventListener("keypress", keyPressListener);
  console.log("session started");
}

function exit() {
  /**
   * cleanup all events, remove event listeners, reset render
   */
  document.body.removeEventListener("keypress", keyPressListener);
  chrome.runtime.sendMessage({ status: "exit" });
  console.log("session ended");
}
