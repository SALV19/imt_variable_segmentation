$("#percentile-avg").change(() => {
  if ($("#percentile-avg").is(":checked")) {
    $("#percentile-label").text("Percentil");
    $("#percentile").attr("type", "number");
  } else {
    $("#percentile-label").text("Media");
    $("#percentile").attr("type", "hidden");
  }
});

// Button functionality to upload file
function loadFile(buttonElement) {
  const $input = $("#file_input");
  $input.click();
}

$("#file_input").on("change", (element) => {
  $("#loaded_files").show()
  $("#file_names").empty()
  Array.from(element.target.files).forEach(file => 
    $("#file_names").append(`<li>${file.name}</li>`)
  )
})

// Send files
$("#iri_form, #friccion_form").on("submit", (e) => {
  e.preventDefault();

  const data = new FormData();
  const $file = $("#file_input").get(0);
  let emptyFile = true;

  if ($file.files.length > 0)
    emptyFile = false;

  data.append("file", $file.files[0]);

  // Error no file provided
  if (emptyFile) {
    console.log("Error");
    const submit_btn = document.querySelector("#submit");
    const error_message = document.querySelector("#error_message");

    error_message.classList.remove("hidden");

    submit_btn.classList.add("error", "bg-red-600", "hover:bg-red-700");
    setInterval(() => {
      submit_btn.classList.remove("error");
    }, 1000);
    return;
  }

  // Load form information of selected configuration
  let input_values = {};
  $("input[name=selected_configuration]")
    .filter((_idx, element) => element.checked == true)
    .each((_idx, element) => {
      const id = element.id;

      input_values[`${id}_values`] = {};

      $(`.${id}_input`).each((_idx, element) => {
        input_values[`${id}_values`][element.id] = element.value;
      });

      data.append(id, JSON.stringify(input_values[`${id}_values`]));
    });

  fetch("/upload_file", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((json_response) => handleJSON(json_response))
    .catch((error) => {
      alert(error);
      console.log(error);
    });
});
