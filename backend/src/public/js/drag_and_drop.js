function dragstartHandler(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  ev.target.closest("div").appendChild(document.getElementById(data));
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

function draggableClick(element) {
  changeForm(element.id);
}
