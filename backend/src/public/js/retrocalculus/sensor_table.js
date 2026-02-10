$("#general_inputs :input, #layers :input, #sensors :input").on("input", (ev) =>
  update_sensors(),
);
$("#general_inputs :input, #layers :input, #sensors :input").on("paste", (ev) =>
  update_sensors(),
);

function update_sensors() {
  const ms1 = $("#sensor_superficial_d1");
  ms1.val(getMs1().toFixed(2));

  for (let i = 2; i <= 9; i++) {
    const cell = $(`#sensor_superficial_d${i}`);
    cell.val(getMsVal(i).toFixed(2));
  }

  analyze_layers();
}

function getMs1() {
  const load = $("#load").val();
  const poisson_1 = $("#l1_poisson").val();
  const deflexion_1 = $("#sensor_deflexion_d1").val();
  const radius = $("#radius").val();

  const result =
    (2 * load * (1 - Math.pow(poisson_1, 2))) /
    ((Math.PI * radius * deflexion_1) / 1000);

  return result;
}

function getMsVal(idx) {
  const load = $("#load").val();
  const poisson_1 = $("#l1_poisson").val();
  const geofon_space = $(`#sensor_geofon_d${idx}`).val();
  const deflexion = $(`#sensor_deflexion_d${idx}`).val();

  const result =
    (load * (1 - Math.pow(poisson_1, 2))) /
    ((Math.PI * geofon_space * deflexion) / 1000);

  return result;
}
