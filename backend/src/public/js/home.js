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
  console.log(id);
  $("div[id$=_form]").each((idx, element) => {
    $(element).hide();
    if (element.id == id + "_form") {
      $(element).removeClass("hidden");
      $(element).show();
    }
  });
}
