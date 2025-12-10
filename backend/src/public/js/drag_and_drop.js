function dragstartHandler(ev) {
  const items = $(".selected-draggable-item")
    .map((_, item) => item.id)
    .get();
  const selected = items.length > 0 ? JSON.stringify(items) : ev.target.id;

  ev.dataTransfer.setData("application/json", selected);
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  let data;
  try {
    data = JSON.parse(ev.dataTransfer.getData("application/json"));
    data.forEach((id) => {
      ev.target.closest("div").appendChild(document.getElementById(id));
    });
  } catch {
    data = ev.dataTransfer.getData("application/json");
    ev.target.closest("div").appendChild(document.getElementById(data));
  } finally {
    $(".selected-draggable-item").each((_, e) => {
      e.classList.remove("selected-draggable-item");
    });
  }
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
  if (!e.target.id.includes("static")) changeForm(e.target.id);
}
