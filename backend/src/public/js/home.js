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
  const id = event.target.id;
  changeForm(id);
});

function changeForm(id) {
  $("#form_title").text(id.toUpperCase());
  $("form[action='/upload_file']").each((idx, element) => {
    $(element).hide();
    if (element.id == id + "_form") {
      $(element).removeClass("hidden");
      $(element).show();
    }
  });
}
