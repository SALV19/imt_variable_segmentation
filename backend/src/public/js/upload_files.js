$("#percentile-avg").change(() => {
  if ($("#percentile-avg").is(":checked")) {
    $("#percentile-label").text("Percentil");
    $("#percentile").attr("type", "number");
  } else {
    $("#percentile-label").text("Media");
    $("#percentile").attr("type", "hidden");
  }
});

// Send files
$("[id$=_form]").on("submit", (e) => {
  e.preventDefault();

  let errors = 0;
  $("#error_message").html("");

  const data = new FormData();
  const $file = $("#file_input").get(0);
  let emptyFile = true;

  if ($file.files.length > 0) emptyFile = false;

  data.append("file", $file.files[0]);

  // Error no file provided
  if (emptyFile) {
    send_error_message("Error: Ingresa por lo menos un archivo");
    errors = 1;
  }

  // Load form information of selected configuration
  let input_values = {};
  $("#selected")
    .children("p")
    .each((idx, element) => {
      const id = element.id;

      input_values[`${id}_values`] = {};

      $(`.${id}_input`).each((_idx, element) => {
        input_values[`${id}_values`][element.id] = element.value;
      });

      data.append(id, JSON.stringify(input_values[`${id}_values`]));
    });
  // $("input[name=selected_configuration]")
  //   .filter((_idx, element) => element.checked == true)
  //   .each((_idx, element) => {
  //   });

  if (Object.keys(input_values).length <= 0) {
    send_error_message(
      "Error: Selecciona al menos una opción en la sección de configuración"
    );
    errors = 1;
  }

  if (errors < 1)
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

function send_error_message(error) {
  const submit_btn = document.querySelector("button[name=send]");
  const error_message = document.querySelector("#error_message");

  const new_error_message = document.createElement("p");
  new_error_message.innerHTML = error;

  error_message.appendChild(new_error_message);
  error_message.classList.remove("hidden");

  submit_btn.classList.add("error", "bg-red-600", "hover:bg-red-700");
  setInterval(() => {
    submit_btn.classList.remove("error");
  }, 1000);
}
