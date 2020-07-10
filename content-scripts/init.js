let appStatus = "idle";

let KEYS = ["j", "k", "f", "h", "g", "c"];

let defaultScrollBehaviour = document.documentElement.style["scrollBehavior"];
let scrollBehavior = "smooth";
let scrollHeight = 200;
let scrollWidth = 200;

let selectors = ["button", "a"];

chrome.storage.local.get(undefined, function (data) {
  KEYS = [data.scrollUpKey, data.scrollDownKey, data.clickStartKey, ...data.traverseKeys];

  if (data.scrollBehavior) scrollBehaviour = data.scrollBehavior;
  if (data.selectors) selectors = data.selectors;
  if (data.scrollHeight) scrollHeight = data.scrollHeight;
  if (data.scrollWidth) scrollWidth = data.scrollWidth;
});

let cssInjected = false;
function injectCss() {
  if (!cssInjected) {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = chrome.runtime.getURL("content-scripts/overlayCss.css");
    document.head.appendChild(cssLink);
    cssInjected = true;
  }
}

function Node(
  /**
   * the job to perform when user hits this node
   */

  job = undefined,
  /**
   * an array of child nodes with fixed indexes and keys mapping
   */
  children = undefined
) {
  this.job = job;
  this.children = children;
}
Node.prototype = {
  constructor: Node,
  gotoChild(input) {
    /**
     * goes to a child wrt to the input and also performs the job
     * if no child was found for the input then cleanup and exit
     */

    currentNode = this.children[KEYS.indexOf(input)];
    if (currentNode) {
      if (currentNode.job) currentNode.job();
    } else exit();
  },
  getLeaves(customNodesStartIndex = MAIN_NODES.length) {
    /**
     * get leaf nodes (except the main nodes because of recurssion) with their paths
     * returns leaf nodes with their path
     */
    const leaves = [];
    (function traverse(path, node) {
      if (node.children === undefined) leaves.push({ path, node });
      else
        node.children.slice(customNodesStartIndex).forEach((node, index) => {
          traverse(path + KEYS[customNodesStartIndex + index], node);
        });
    })("", this);
    return leaves;
  },
};

function PathOverlay(path, element) {
  this.overlayElement = (() => {
    const el = document.createElement("div");
    el.className = "keynavPathContainerBox";
    const rect = element.getBoundingClientRect();
    el.style.left = (rect.left + window.scrollX).toString() + "px";
    el.style.top = (rect.top + window.scrollY).toString() + "px";
    el.style.zIndex = this.__proto__.lastZIndex++;
    el.innerHTML = `<span class="keynavPath">${path.toUpperCase()}</span>`;
    return el;
  })();
  this.addOverlayElement();
}
PathOverlay.prototype = {
  constructor: PathOverlay,
  container: null,
  lastZIndex: 10000,

  startContainer() {
    if (this !== PathOverlay.prototype) throw Error("Illegal call to the function");

    if (this.container) {
      document.documentElement.removeChild(this.container);
    }

    const overlayContainer = document.createElement("div");
    overlayContainer.id = "keynavOverlayContainer";
    document.documentElement.appendChild(overlayContainer);
    this.container = overlayContainer;
  },

  removeContainer() {
    if (this !== PathOverlay.prototype) throw Error("Illegal call to the function");

    if (this.container) {
      document.documentElement.removeChild(this.container);
      this.container = null;
    }
  },

  addOverlayElement() {
    this.container.appendChild(this.overlayElement);
  },
  removeOverlayElement() {
    this.container.removeChild(this.overlayElement);
  },
};

const SCROLL_DOWN_NODE = new Node(function () {
  // scroll down
  PathOverlay.prototype.removeContainer();
  window.scrollBy(0, scrollHeight);
});

const SCROLL_UP_NODE = new Node(function () {
  // scroll up
  PathOverlay.prototype.removeContainer();
  window.scrollBy(0, -scrollHeight);
});

// const HOVER_NODE = new Node(function () {
//   // generate child nodes
//   // change display to override elements
//   getAllValidElements();
//   let elements = getElementsWithInDisplay();
//   this.children = generateGraph(elements, true).children;

//   injectCss();

//   const leaves = this.getLeaves();

//   PathOverlay.prototype.startContainer();

//   leaves.forEach((leaf) => {
//     new PathOverlay(leaf.path, leaf.node.element);
//   });
// });

const CLICK_NODE = new Node(function () {
  // generate child nodes
  // change display to override elements
  let elements = getElementsWithInDisplay();
  this.children = [...MAIN_NODES, ...generateGraph(elements)];

  injectCss();

  const leaves = this.getLeaves();
  PathOverlay.prototype.startContainer();

  leaves.forEach((leaf) => {
    new PathOverlay(leaf.path, leaf.node.element);
  });
});

const MAIN_NODES = [SCROLL_DOWN_NODE, SCROLL_UP_NODE, CLICK_NODE]; // todo: add horizontal scroll nodes

SCROLL_DOWN_NODE.children = MAIN_NODES;
SCROLL_UP_NODE.children = MAIN_NODES;
CLICK_NODE.children = MAIN_NODES;

const ROOT_NODE = new Node(undefined, MAIN_NODES);
let currentNode = ROOT_NODE;

function isVisible(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top > 0 &&
    rect.left >= 0 &&
    rect.bottom < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right < (window.innerWidth || document.documentElement.clientWidth)
  );
}

function getElementsWithInDisplay(tags = selectors) {
  /**
   * gets the elements of dom within screen view
   * elements to be captured can be provided by the user
   * linear filtering is applied which need to be changed with recursive later
   */
  return Array.from(document.querySelectorAll(tags.join())).filter((el) => isVisible(el));
}

function generateGraph(elements, isHover = false) {
  /**
   * generate linked graph for the captured html elements
   * jobs must click or hover the element according to the parameter provided
   * return a node
   */
  const navKeys = KEYS.slice(MAIN_NODES.length);
  if (navKeys.length < 2) throw Error("Button clicking keys must be 2 or more.");
  const elementNodes = elements.map((el) => {
    const node = new Node(function () {
      exit();
      this.element.click();
    });
    node.element = el;
    return node;
  });
  function generateChildren(nodes, childrenNumber) {
    if (nodes.length <= childrenNumber) return nodes;
    const parentNodes = [];
    while (nodes.length > 0) {
      let parentNode = new Node(undefined, [...MAIN_NODES]);
      for (let i = 0; i < childrenNumber; i++) {
        let child = nodes.pop();
        if (child === undefined) break;
        parentNode.children.push(child);
      }
      parentNodes.push(parentNode);
    }
    return generateChildren(parentNodes, childrenNumber);
  }
  return generateChildren(elementNodes, navKeys.length);
}

function keyPressListener(e) {
  /**handles key press
   * mainly calls gotoChild of current node
   */
  try {
    currentNode.gotoChild(e.key);
  } catch (error) {
    exit(error);
  }
}

function start() {
  console.log("session started");
  document.documentElement.style["scrollBehavior"] = scrollBehavior;
  document.body.addEventListener("keypress", keyPressListener);
  appStatus = "running";
}

function exit(error = null) {
  /**
   * cleanup all events, remove event listeners, reset render
   */
  if (error) console.error(error);
  if (PathOverlay.prototype.container) {
    document.documentElement.removeChild(PathOverlay.prototype.container);
    PathOverlay.prototype.container = null;
  }

  document.documentElement.style["scrollBehavior"] = defaultScrollBehaviour;
  currentNode = ROOT_NODE;
  appStatus = "idle";
  document.body.removeEventListener("keypress", keyPressListener);
  console.log("session ended");
}

// export default generateGraph;
