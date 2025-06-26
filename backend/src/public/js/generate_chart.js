function create_data(json_response) {
  const measurements = json_response.measurements
  const segmentation = json_response.segmentation

  form.classList.add("hide")
  const ctx = document.getElementById("myChart")

  let labels = measurements.measurements;
  let dataset1Data = measurements.iri;
  let dataset2Data = segmentation;

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
                  return (measurements.measurements[idx] % 500 === 0) 
                    ? Math.floor(measurements.measurements[idx] / 1000) + "+" + measurements.measurements[idx] % 1000 / 100 + "00"
                    : ''
                },
              }
            },
            y: {
              position: 'left',
              title: {
                display: true,
                text: 'IRI',
                font: {
                  size: 20,
                  weight: 'bold',
                  family: 'Arial'
                },
                color: 'darkblue'
              },
              beginAtZero: true,
              scaleLabel: {
                display: true,
                labelString: 'Values',
              }
            },
            y1: {
              position: 'right',
              title: {
                display: true,
                text: 'IRI',
                font: {
                  size: 20,
                  weight: 'bold',
                  family: 'Arial'
                },
                color: 'darkblue'
              },
              beginAtZero: true,
              scaleLabel: {
                display: true,
                labelString: 'Values',
              },
              grid: {
                    drawOnChartArea: false,
                }
            }
          },
          plugins: {
            legend: {
                onClick: (e, legendItem, legend) => {
                    const chart = legend.chart;
                    const datasetIndex = legendItem.datasetIndex;
                    const meta = chart.getDatasetMeta(datasetIndex);

                    meta.hidden = !meta.hidden;

                    if (meta.yAxisID === 'y1') {
                        chart.options.scales.y1.display = !meta.hidden;
                    }

                    chart.update(); 
                }
            }
          }
        }

  // Creating line chart
  let myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Iri',
            data: dataset1Data,
            borderColor: 'blue',
            yAxisID: 'y'
          },
          {
            label: 'Segmentation',
            data: dataset2Data,
            borderColor: 'red',
            yAxisID: 'y1'
          },
        ]
      },
      options: options
  });

}