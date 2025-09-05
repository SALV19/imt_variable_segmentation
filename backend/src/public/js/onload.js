document.addEventListener("DOMContentLoaded", () => {
  $("#form_title").text("IRI");
  $("#percentile-avg").trigger("change");
  $("input[id=iri]").prop("checked", true);
  $("#files_input").val("")
});
