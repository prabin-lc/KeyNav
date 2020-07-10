document.querySelector("div>form").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(e);
});

function duplicateAndInsert(tag) {
  const dup = tag.cloneNode();
  tag.insertAdjacentElement("afterend", dup);
}
