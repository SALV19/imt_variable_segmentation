$("#test").on("click", () => analize_layers());

function analize_layers() {
  const d1 = new Desplazamiento_1();
  const d2 = new Desplazamiento_2();
  const d3 = new Desplazamiento_3();
  d1.calculate_segments();
  d2.calculate_segments();
  d3.calculate_segments();

  const load = parseFloat($("#load").val());
  const poisson = parseFloat($("#l1_poisson").val());
  const radius = parseFloat($("#radius").val());

  const deflexion = d1.sensors.map(
    (curr, idx) => curr + d2.sensors[idx] + d3.sensors[idx],
  );

  const superficial_module = deflexion.map((curr, idx) => {
    const geofono = parseFloat($(`#sensor_geofon_d${idx + 1}`).val());

    return idx == 0
      ? (2 * load * (1 - Math.pow(poisson, 2))) /
          ((Math.PI * radius * curr) / 1000)
      : (load * (1 - Math.pow(poisson, 2))) /
          ((Math.PI * geofono * curr) / 1000);
  });
  updateResultTable(deflexion, superficial_module);
}

function updateResultTable(deflexion, superficial_module) {
  deflexion.forEach((curr, idx) => {
    $(`#sensor_final_deflexion_d${idx + 1}`).val(curr.toFixed(2));
    $(`#sensor_final_superficial_module_d${idx + 1}`).val(
      superficial_module[idx].toFixed(2),
    );
  });
}
