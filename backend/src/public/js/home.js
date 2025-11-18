$("#info").on("click", function () {
  $("#info").addClass("selected");
  $("#components").removeClass("selected");

  $("#info_module").show();
  $("#components_module").hide();
});

$("#components").on("click", function () {
  $("#info").removeClass("selected");
  $("#components").addClass("selected");

  $("#info_module").hide();
  $("#components_module").show();
});

$("button[id^=component_]").on("click", function (event) {
  $("button[id^=component_]").each((idx, e) => {
    const id = e.id.split("component_")[1];

    if (event.target.id == e.id) {
      e.classList.add("selected");
      $(`div[id=${id}_module]`).show("selected");
    } else {
      e.classList.remove("selected");
      $(`div[id=${id}_module]`).hide("selected");
    }
  });
});

$("p[id^=label]").on("click", (event) => {
  console.log("Click");
  const id = event.target.id.replace("label_", "");
  console.log(id);

  changeForm(id);
});

function changeForm(id) {
  $("form[action='/upload_file']").each((idx, element) => {
    $(element).hide();
    if (element.id == id + "_form") {
      $(element).removeClass("hidden");
      $(element).show();
    }
  });
}
