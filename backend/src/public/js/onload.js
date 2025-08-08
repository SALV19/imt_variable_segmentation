document.addEventListener("DOMContentLoaded", () => {
  input_elements.forEach((i) => (i.value = null));
  $("#percentile-avg").trigger("change");
});
