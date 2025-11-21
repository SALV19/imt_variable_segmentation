$("button[id^=tab_]").on("click", function (event) {
  $("button[id^=tab_]").each((idx, e) => {
    const id = e.id.split("tab_")[1];

    if (event.target.id == e.id) {
      e.classList.add("selected");
    } else {
      e.classList.remove("selected");
    }
  });

  $("form[action='/upload_file']").each((idx, element) => {
    if (event.target.id == "tab_s_homogenous") {
      changeForm("s_homogenea");
    } else {
      changeForm("iri");
    }
  });
});
