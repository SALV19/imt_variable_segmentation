// Button functionality to upload file
function loadFile(buttonElement) {
  const $input = $("#file_input");
  $input.click();
}

$("#file_input").on("change", (element) => {
  $("#loaded_files").show();
  $("#file_names").empty();
  Array.from(element.target.files).forEach((file) =>
    $("#file_names").append(`<li>${file.name}</li>`)
  );
});
