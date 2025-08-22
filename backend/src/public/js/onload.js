document.addEventListener("DOMContentLoaded", () => {
  $("[id^=file_upload_input]").each((idx, element) => (element.value = null));
  $("#form_title").text("IRI");
  $("#percentile-avg").trigger("change");
  $("input[id=iri]").prop("checked", true);
});
