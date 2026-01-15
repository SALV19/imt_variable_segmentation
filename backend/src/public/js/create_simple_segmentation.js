function create_simple_segmentation(json_response, id_selector) {
  const measurements = json_response.file_data;
  const slopes = json_response.slopes;

  const slopes_data = get_slopes_data(slopes);

  const chartArea = document.querySelector("#chartArea");

  $("#form_selection").hide();
  chartArea.classList.remove("hidden");
  chartArea.classList.add("flex");

  // Create chart
  const canvas = document.createElement("canvas");
  canvas.id = id_selector + "_canvas";
  $("#chart_container").append(canvas);
  const ctx = document.getElementById(id_selector + "_canvas");
  ctx.parentElement.classList.remove("hide");

  let labels = measurements.measurements;

  options = {
    responsive: true,
    pointRadius: 0,
    showAllLabels: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          stepSize: 1,
          // callback: (val, idx) => {
          //   const length = measurements.measurements.length;
          //   const ammount = Math.floor(length / 500);
          //   if (length > 500)
          //     return measurements.measurements[idx] % (500 * ammount) === 0
          //       ? Math.floor(measurements.measurements[idx] / 1000) +
          //           "+" +
          //           (measurements.measurements[idx] % 1000) / 100 +
          //           "00"
          //       : "";
          //   return measurements.measurements[idx] % 500 === 0
          //     ? Math.floor(measurements.measurements[idx] / 1000) +
          //         "+" +
          //         (measurements.measurements[idx] % 1000) / 100 +
          //         "00"
          //     : "";
          // },
        },
      },
      y: {
        position: "left",
        title: {
          display: true,
          text: id_selector.toUpperCase(),
          font: {
            size: 20,
            weight: "bold",
            family: "Arial",
          },
          color: "darkblue",
        },
        beginAtZero: false,
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
      ],
    },
    options: options,
  });

  // Table data
  const table = `
    <tbody>
      <tr><td><h1 class="font-bold mt-2">${id_selector.toUpperCase()}</h1></td></tr>
      <tr>
        <td class="w-32">Media</td>
        <td id="media_${id_selector}"></td>
      </tr>
      <tr>
        <td class="w-32">Máximo</td>
        <td id="max_${id_selector}"></td>
      </tr>
      <tr>
        <td class="w-32">Mínimo</td>
        <td id="min_${id_selector}"></td>
      </tr>
      <tr>
        <td class="w-32">Total de segmentos</td>
        <td id="total_${id_selector}"></td>
      </tr>
      </tbody>`;
  $("#table").append(table);
  const media = document.querySelector(`#media_${id_selector}`);
  media.innerHTML = measurements.average.toFixed(2);
  const max = document.querySelector(`#max_${id_selector}`);
  max.innerHTML = measurements.max.toFixed(2);
  const min = document.querySelector(`#min_${id_selector}`);
  min.innerHTML = measurements.min.toFixed(2);
  const total = document.querySelector(`#total_${id_selector}`);
  total.innerHTML = measurements.total.toFixed(2);
}
