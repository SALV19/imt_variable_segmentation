function superficial_chart() {
  // const ctx = document.getElementById("superficial-chart");
  const canva_container = document.getElementById("superficial-chart");
  const canva = document.createElement("canvas");
  canva.id = "superficial-chart-element";
  canva_container.innerHTML = "";
  canva_container.appendChild(canva);
  const ctx = document.getElementById("superficial-chart-element");

  const geofonos = $("input[id^='sensor_geofon_d'");
  const labels = Array.from(geofonos.map((_idx, v) => v.value));

  const superficial = $("input[id^='sensor_superficial_d'");
  const measured = Array.from(superficial.map((_idx, v) => v.value));

  const superficial_calculated = $(
    "input[id^='sensor_final_superficial_module_d'",
  );
  const calculated = Array.from(
    superficial_calculated.map((_idx, v) => v.value),
  );

  options = {
    responsive: true,
    showAllLabels: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Modulo Superficial (MPa)",
          font: {
            size: 20,
            weight: "bold",
            family: "Arial",
          },
          color: "darkblue",
        },
      },
      y: {
        reverse: true,
        title: {
          display: true,
          text: "Distancia radial (mm)",
          font: {
            size: 20,
            weight: "bold",
            family: "Arial",
          },
          color: "darkblue",
        },
      },
    },
  };

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Deflexión calculada",
          data: calculated,
          borderColor: "blue",
          yAxisID: "y",
          tension: 0,
        },
        {
          label: "Deflexión Medida",
          data: measured,
          borderColor: "orange",
          yAxisID: "y",
          tension: 0,
        },
      ],
    },
    options: options,
  });
}
