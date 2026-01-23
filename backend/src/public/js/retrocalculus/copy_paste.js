// Erase previous content
document.addEventListener("DOMContentLoaded", () => {
  const Ginputs = getGeneralInputs()
  const Linputs = getLayerInputs()
  const Sinputs = getSensorInputs()
  Ginputs.each((idx, i) => {
    i.value = null
  })
  Linputs.each((idx, i) => {
    i.value = null
  })
  Sinputs.each((idx, i) => {
    i.value = null
  })
})

// Get general content input values
function getGeneralInputs() {
  const inputs = $("#general_inputs :input");
  return inputs;
}

// Get layers inputs
function getLayerInputs() {
  const inputs = $("#layers :input");
  return inputs;
}

// Get sensor inputs
function getSensorInputs() {
  const inputs = $("#sensors :input");
  return inputs;
}

// Smart paste all values
$("#load").on("paste", (ev) => {
  ev.preventDefault()

  const inputs = getGeneralInputs();
  const paste = ev.originalEvent.clipboardData.getData('text');
  const content = paste.split("\n")

  pasteContent(content, inputs)
})

$("#layers :input").on("paste", (ev) => {
  ev.preventDefault();

  const inputs = getLayerInputs();
  const paste = ev.originalEvent.clipboardData.getData("text");
  const rows = paste.split("\n");

  rows.forEach((r, idx) => {
    if (!r) return
    pasteContent(r.split("\t"), Array.from(inputs).splice(idx * inputs.length / 3, inputs.length / 3 + idx * inputs.length))
  })
})

$("#sensors :input").on("paste", (ev) => {
  ev.preventDefault();

  const inputs = getSensorInputs();
  const paste = ev.originalEvent.clipboardData.getData("text");
  const rows = paste.split("\n");

  rows.forEach((r, idx) => {
    if (!r) return
    pasteContent(r.split("\t"), Array.from(inputs).splice(idx * inputs.length / 3, inputs.length / 3 + idx * inputs.length))
  })
})

function pasteContent(content, inputs) {
  content.forEach((c, idx) => {
    if (idx >= inputs.length) return;

    const current = inputs[idx]
    if (c) {
      current.value = c 
    }
  });
}