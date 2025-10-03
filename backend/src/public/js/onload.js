document.addEventListener("DOMContentLoaded", () => {
  $("#form_title").text("IRI");
  $("#percentile-avg").trigger("change");
  $("#file_input").val("");

  $("input[type=checkbox]").each((id, element) => {
    if (element.id.includes("_") && element.checked) {
      console.log("Selected special option");
      specialInstruccions();
    }
  });
});
