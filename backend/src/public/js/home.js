$("#info").on("click", function () {
  $("#info").addClass("selected");
  $("#components").removeClass("selected");

  $("#information_module").show();
  $("#configuration_module").hide();
});

$("#components").on("click", function () {
  $("#info").removeClass("selected");
  $("#components").addClass("selected");

  $("#information_module").hide();
  $("#configuration_module").show();
});

$("input[name=selected_configuration]").change((event) => {
  console.log("iri selected", event.target.id);
});
