const form = document.querySelector("#form")

form.addEventListener("submit", (e) => {
  e.preventDefault()

  const data = new FormData()
  const file = document.querySelectorAll("input")

  file.forEach(f => {
    if (f.files.length != 0) {
      data.append("file", f.files[0])
    }
  })

  fetch("/upload_file", {
    "method": "POST",
    "body": data
  })
    .then((res) => res.json())
    .then(json_response => create_data(json_response))
})

function show_second() {
  const hidden_input = document.querySelector("#hidden")
  hidden_input.type = "file"
}