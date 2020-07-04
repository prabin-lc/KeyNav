let appStatus = "idle";

const KEYS = ["j", "k", "a", "c", "h", "g", "f"];

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
  currentNode = this.children[KEYS.indexOf(input)];
  if (currentNode) {
    if (currentNode.job) currentNode.job();
  } else exit();
};
Node.prototype.getLeaves = function () {
  /**
   * get leaf nodes (except the main nodes because of recurssion) with their paths
   */
};

const SCROLL_DOWN_NODE = new Node(function () {
  // scroll down
  window.scrollBy(0, 200);
});

const SCROLL_UP_NODE = new Node(function () {
  // scroll up
  window.scrollBy(0, -200);
});

const HOVER_NODE = new Node(function () {
  // generate child nodes
  // change display to override elements
});

const CLICK_NODE = new Node(function () {
  // generate child nodes
  // change display to override elements
});

const MAIN_NODES = [SCROLL_DOWN_NODE, SCROLL_UP_NODE, HOVER_NODE, CLICK_NODE, new Node()];

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
  console.log(e);
  try {
    currentNode.gotoChild(e.key);
  } catch (error) {
    exit(error);
  }
}

function start() {
  console.log("session started");
  document.getElementsByTagName("html")[0].style["scrollBehavior"] = "smooth";
  document.body.addEventListener("keypress", keyPressListener);
  appStatus = "running";
}

function exit(error) {
  /**
   * cleanup all events, remove event listeners, reset render
   */
  if (error) console.error(error);
  document.body.removeEventListener("keypress", keyPressListener);
  currentNode = ROOT_NODE;
  appStatus = "idle";
  console.log("session ended");
}
