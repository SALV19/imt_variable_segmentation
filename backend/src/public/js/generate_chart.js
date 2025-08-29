function create_data(json_response) {
  console.log(json_response);
  const measurements = json_response.measurements;
  const filter = json_response.filter_measurements;
  const segmentation = json_response.segmentation;
  const slopes = json_response.slopes;
  const abnormalities = json_response.abnormalities;

  const slopes_data = slopes
    .map((val) => {
      return [
        {
          x: val.start,
          y: val.iri,
        },
        {
          x: val.end,
          y: val.iri,
        },
      ];
    })
    .flatMap((data) => data);

  const chartArea = document.querySelector("#chartArea");

  $("#form_selection").hide();
  chartArea.classList.remove("hidden");
  chartArea.classList.add("flex");

  // Create chart
  const ctx = document.getElementById("myChart");
  ctx.parentElement.classList.remove("hide");

  let labels = measurements.measurements;
  let iri = measurements.iri;

  options = {
    responsive: true,
    pointRadius: 0,
    showAllLabels: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          stepSize: 1,
          callback: (val, idx) => {
            const length = measurements.measurements.length;
            const ammount = Math.floor(length / 500);
            if (length > 500)
              return measurements.measurements[idx] % (500 * ammount) === 0
                ? Math.floor(measurements.measurements[idx] / 1000) +
                    "+" +
                    (measurements.measurements[idx] % 1000) / 100 +
                    "00"
                : "";
            return measurements.measurements[idx] % 500 === 0
              ? Math.floor(measurements.measurements[idx] / 1000) +
                  "+" +
                  (measurements.measurements[idx] % 1000) / 100 +
                  "00"
              : "";
          },
        },
      },
      y: {
        position: "left",
        title: {
          display: true,
          text: "IRI",
          font: {
            size: 20,
            weight: "bold",
            family: "Arial",
          },
          color: "darkblue",
        },
        beginAtZero: true,
        scaleLabel: {
          display: true,
          labelString: "Values",
        },
      },
      y1: {
        position: "right",
        display: false,
        title: {
          display: true,
          text: "Z_x",
          font: {
            size: 20,
            weight: "bold",
            family: "Arial",
          },
          color: "darkblue",
        },
        beginAtZero: true,
        scaleLabel: {
          display: true,
          labelString: "Values",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        onClick: (e, legendItem, legend) => {
          const chart = legend.chart;
          const datasetIndex = legendItem.datasetIndex;
          const meta = chart.getDatasetMeta(datasetIndex);

          meta.hidden = !meta.hidden;

          if (meta.yAxisID === "y1") {
            chart.options.scales.y1.display = !meta.hidden;
          }

          chart.update();
        },
      },
    },
  };

  // Creating line chart
  let myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Segmentos Homogeneos",
          data: slopes_data,
          borderColor: "black",
          yAxisID: "y",
          tension: 0,
          segment: {
            borderColor: (ctx) =>
              ctx.p0.parsed.y === ctx.p1.parsed.y ? "black" : "transparent",
          },
        },
        {
          label: "Abnormality",
          data: abnormalities,
          showLine: false,
          pointRadius: 4,
          borderRadius: 2,
          borderColor: "red",
          yAxisID: "y",
        },
        {
          label: "Iri",
          data: iri,
          borderColor: "blue",
          yAxisID: "y",
        },
        {
          label: "Filtrado",
          data: filter,
          borderColor: "green",
          hidden: true,
          yAxisID: "y",
        },
        {
          label: "Segmentation",
          data: segmentation,
          borderColor: "red",
          hidden: true,
          yAxisID: "y1",
        },
      ],
    },
    options: options,
  });

  // Table data
  const media = document.querySelector("#media");
  media.innerHTML = measurements.average.toFixed(2);
  const max = document.querySelector("#max");
  max.innerHTML = measurements.max.toFixed(2);
  const min = document.querySelector("#min");
  min.innerHTML = measurements.min.toFixed(2);
  const total = document.querySelector("#total");
  total.innerHTML = measurements.total.toFixed(2);
  const method = document.querySelector("#method");
  method.innerHTML = json_response.method;
}
