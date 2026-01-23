// Erase previous content
document.addEventListener("DOMContentLoaded", () => {
  const inputs = getGeneralInputs()
  inputs.each((idx, i) => {
    i.value = null
  })
})

// Get general content input values
function getGeneralInputs() {
  const inputs = $("#general_inputs :input");
  return inputs;
}

// Smart paste all values
$("#load").on("paste", (ev) => {
  ev.preventDefault()
  console.log(ev)

  const inputs = getGeneralInputs();
  const paste = ev.originalEvent.clipboardData.getData('text');
  const content = paste.split("\n")

  document.activeElement.value = null;
  pasteContent(content, inputs)
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