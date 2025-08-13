document.addEventListener("DOMContentLoaded", () => {
  input_elements.forEach((i) => (i.value = null));
  $("#form_title").text("IRI");
  $("#percentile-avg").trigger("change");
  $("input[id=iri]").prop("checked", true);
});
