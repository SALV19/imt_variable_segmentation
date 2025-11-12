function dragstartHandler(ev) {
  const items = $(".selected-draggable-item")
    .map((_, item) => item.id)
    .get();
  console.log(items);
  ev.dataTransfer.setData("application/json", JSON.stringify(items));
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  const data = JSON.parse(ev.dataTransfer.getData("application/json"));
  data.forEach((id) => {
    ev.target.closest("div").appendChild(document.getElementById(id));
  });
  $(".selected-draggable-item").each((_, e) => {
    e.classList.remove("selected-draggable-item");
  });
}

function selectAll() {
  $("#unselected")
    .children("p")
    .each((idx, element) => {
      $("#selected").append(element);
    });
}

function deselectAll() {
  $("#selected")
    .children("p")
    .each((idx, element) => {
      $("#unselected").append(element);
    });
}

function draggableClick(e) {
  if (e.shiftKey) {
    e.target.classList.toggle("selected-draggable-item");
  }
  changeForm(e.target.id);
}
