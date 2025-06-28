const form = document.querySelector("#form")
const file_input_labels = document.querySelectorAll(".label_input")
const input_elements = document.querySelectorAll("input[type=file], input[type=hidden]")

// Drag and drop functionalities for file upload
file_input_labels.forEach((labelElement) => {
  const content = labelElement.querySelector(".insert_file")
  content.addEventListener('dragover', (e) => {
    e.preventDefault();
    content.classList.add('dragover');
  });

  content.addEventListener('dragleave', () => {
    content.classList.remove('dragover');
  });


  content.addEventListener('drop', (e) => {
    e.preventDefault()
    content.classList.remove("dragover")

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input_id = labelElement.getAttribute("for")
      const input = document.querySelector(`#${input_id}`)
      input.files = files

      input.dispatchEvent(new Event('change'))
    }
  })
})

// Button functionality to upload file
function loadFile(buttonElement) {
  const input_id = buttonElement.parentElement.parentElement.getAttribute('for')
  const input = document.querySelector(`#${input_id}`)

  input.click()
}

// Show second file input label and activate
function show_second() {
  const hidden_label = document.querySelector("label[for=hidden]")
  hidden_label.classList.remove('hidden')
  const hidden_input = document.querySelector("#hidden")
  hidden_input.type = "file"
}

input_elements.forEach(element => {
  const labelElement = document.querySelector(`label[for=${element.id}]`)
  const content = labelElement.querySelector(".insert_file")

  element.addEventListener('change', (e) => {
    content.classList.remove('insert_file')
    content.classList.add('hide')
    
    const preload = labelElement.querySelector(".load_file")
    
    preload.textContent = element.files[0].name
    preload.classList.remove('hide')
    preload.classList.add('insert_file')
  })
})

// Send files
form.addEventListener("submit", (e) => {
  e.preventDefault()

  const data = new FormData()
  const file = document.querySelectorAll("input[type=file]")

  file.forEach(f => {
    if (f.files.length != 0) {
      data.append("file", f.files[0])
    }
  })

  const mov_avg = document.querySelector("#moving_avg").value
  data.append("mov_avg", mov_avg)
  fetch("/upload_file", {
    "method": "POST",
    "body": data
  })
    .then((res) => res.json())
    .then(json_response => create_data(json_response))
})