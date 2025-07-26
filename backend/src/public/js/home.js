function info(components_id) {
  const components = document.querySelector(`#${components_id}`);
  const my_element = document.querySelector("#info");
  components.classList.remove("selected");
  my_element.classList.add("selected");
}

function config(info_id) {
  const info = document.querySelector(`#${info_id}`);
  const my_element = document.querySelector("#components");
  info.classList.remove("selected");
  my_element.classList.add("selected");
}
