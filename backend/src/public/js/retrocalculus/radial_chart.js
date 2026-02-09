function radial_chart() {
  const ctx = document.getElementById("radial-chart");

  const geofonos = $("input[id^='sensor_geofon_d'");
  const labels = Array.from(geofonos.map((_idx, v) => v.value));

  const deflexion = $("input[id^='sensor_deflexion_d'");
  const measured = Array.from(deflexion.map((_idx, v) => v.value));

  const fin_deflexion = $("input[id^='sensor_final_deflexion_d'");
  const calculated = Array.from(fin_deflexion.map((_idx, v) => v.value));

  options = {
    responsive: true,
    showAllLabels: true,
    scales: {
      x: {
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
      y: {
        title: {
          display: true,
          text: "Deflexión (μm)",
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
