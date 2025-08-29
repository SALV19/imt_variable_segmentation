const file_input_labels = document.querySelectorAll(".label_input");

$("#percentile-avg").change(() => {
  if ($("#percentile-avg").is(":checked")) {
    $("#percentile-label").text("Percentil");
    $("#percentile").attr("type", "number");
  } else {
    $("#percentile-label").text("Media");
    $("#percentile").attr("type", "hidden");
  }
});

// Drag and drop functionalities for file upload
file_input_labels.forEach((labelElement) => {
  const content = labelElement.querySelector(".insert_file");
  content.addEventListener("dragover", (e) => {
    e.preventDefault();
    content.classList.add("dragover");
  });

  content.addEventListener("dragleave", () => {
    content.classList.remove("dragover");
  });

  content.addEventListener("drop", (e) => {
    e.preventDefault();
    content.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input_id = labelElement.getAttribute("for");
      const input = document.querySelector(`#${input_id}`);
      input.files = files;

      input.dispatchEvent(new Event("change"));
    }
  });
});

// Button functionality to upload file
function loadFile(buttonElement) {
  const input_id =
    buttonElement.parentElement.parentElement.getAttribute("for");
  const input = document.querySelector(`#${input_id}`);

  input.click();
}

// Show second file input label and activate
function show_second(element) {
  const id = element.id.split("_")[3] + "_" + element.id.split("_")[4];
  const $hidden_label = $(`[for=file_upload_input_2_${id}]`);
  $hidden_label.show();
  const $hidden_input = $(`[id=file_upload_input_2_${id}]`);
  $hidden_input.attr("type", "file");
}

$("[id^=file_upload_input]").each((idx, element) => {
  const labelElement = document.querySelector(`label[for=${element.id}]`);
  const content = labelElement.querySelector(".insert_file");

  element.addEventListener("change", (e) => {
    content.classList.remove("insert_file");
    content.classList.add("hide");

    const preload = labelElement.querySelector(".load_file");

    preload.textContent = element.files[0].name;
    preload.classList.remove("hide");
    preload.classList.add("insert_file");
  });
});

// Send files
$("#iri_form, #friction_form").on("submit", (e) => {
  e.preventDefault();

  const data = new FormData();
  const $file = $("input[type=file]");
  let emptyFile = true;

  $file.each((_idx, f) => {
    if (f.files.length) {
      data.append(`${f.name}`, f.files[0]);
      emptyFile = false;
    }
  });

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

  iri_values = {};
  friction_values = {};
  $(".iri_input").each((_idx, element) => {
    iri_values[element.id] = element.value;
  });
  $(".friction_input").each((_idx, element) => {
    friction_values[element.id] = element.value;
  });

  data.append("iri", JSON.stringify(iri_values));
  data.append("friction", JSON.stringify(friction_values));

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
