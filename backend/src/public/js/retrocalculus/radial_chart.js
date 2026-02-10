function radial_chart() {
  const canva_container = document.getElementById("radial-chart");
  // const ctx = document.getElementById("radial-chart");
  const canva = document.createElement("canvas");
  canva.id = "radial-chart-element";
  canva_container.innerHTML = "";
  canva_container.appendChild(canva);
  const ctx = document.getElementById("radial-chart-element");
  console.log(ctx);

  const geofonos = $("input[id^='sensor_geofon_d'");
  const labels = Array.from(geofonos.map((_idx, v) => v.value));

  const deflexion = $("input[id^='sensor_deflexion_d'");
  const measured = Array.from(deflexion.map((_idx, v) => v.value));

  const fin_deflexion = $("input[id^='sensor_final_deflexion_d'");
  const calculated = Array.from(fin_deflexion.map((_idx, v) => v.value));

  options = {
    responsive: true,
    showAllLabels: true,
    maintainAspectRatio: false,
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
        reverse: true,
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
