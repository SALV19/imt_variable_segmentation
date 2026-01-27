// I am just using the formulas of an excel, I don't understand what its doing,
// so sorry for not adding comments
document.addEventListener("DOMContentLoaded", function () {
  $("#l1_he, #l1_fhe").each(function () {
    this.value = 0;
  });
});
$("#general_inputs :input, #layers :input").on("paste", (ev) => {
  update_table();
});

$("#general_inputs :input, #layers :input").on("input", (ev) => {
  update_table();
});

function update_table() {
  $("#l2_he").val(l2_he().toFixed(2));
  $("#l2_fhe").val(l2_fhe().toFixed(2));
  $("#l3_he").val(l3_he().toFixed(2));
  $("#l3_fhe").val(l3_fhe().toFixed(2));
}

function l2_he() {
  const thickness_1 = $("#l1_thickness").val();

  const module_1 = $("#l1_module").val();
  const module_2 = $("#l2_module").val();

  const poisson_1 = $("#l1_poisson").val();
  const poisson_2 = $("#l2_poisson").val();

  const result =
    thickness_1 *
    Math.pow(
      ((module_1 / module_2) * (1 - Math.pow(poisson_2, 2))) /
        (1 - Math.pow(poisson_1, 2)),
      1 / 3,
    );

  return parseFloat(result);
}

function l2_fhe() {
  const result = $("#l2_he").val() * $("#l1_f").val();
  return parseFloat(result);
}

function l3_he() {
  const load = parseFloat($("#load").val());
  const pressure = parseFloat($("#pressure").val());

  const thickness_2 = parseFloat($("#l2_thickness").val());

  const module_2 = parseFloat($("#l2_module").val());
  const module_3 = parseFloat($("#l3_module").val());

  const poisson_2 = parseFloat($("#l2_poisson").val());
  const poisson_3 = parseFloat($("#l3_poisson").val());

  const n_3 = parseFloat($("#l3_n").val());

  const fhe_2 = parseFloat($("#l2_fhe").val());

  const firstPart = Math.pow(fhe_2 + thickness_2, 3) * module_2;
  const secondPart = (1 - 2 * n_3) * module_3;
  const thirdPart =
    secondPart * Math.pow((3 * load) / Math.pow(2 * Math.PI * pressure), n_3);
  const fourthPart = Math.pow(1 - poisson_3, 2);
  const fifthPart = Math.pow(1 - poisson_2, 2);
  const composedPart = (firstPart / thirdPart) * fourthPart;
  const power = 1 / (3 - 2 * n_3);

  const result = Math.pow(composedPart / fifthPart, power);

  console.log(result);

  return parseFloat(result);
}

function l3_fhe() {
  const f_2 = $("#l2_f").val();
  const n_3 = $("#l3_n").val();
  const he_3 = $("#l3_he").val();

  const result = Math.pow(Math.pow(f_2, 3), 1 / (3 - 2 * n_3)) * he_3;

  return result;
}
