function create_data(json_response) {
  form.classList.add("hide")
  const ctx = document.getElementById("myChart")

  let json_response_2 = json_response.iri.map(i => i / 2);
  let labels = json_response.measurements;
  let dataset1Data = json_response.iri;
  let dataset2Data = json_response_2;

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
                  return (json_response.measurements[idx] % 500 === 0) 
                    ? Math.floor(json_response.measurements[idx] / 1000) + "+" + json_response.measurements[idx] % 1000 / 100 + "00"
                    : ''
                },
                color: 'red',
              }
            },
            y: {
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
            fill: false,
          },
          {
            label: 'Solid Line',
            data: dataset2Data,
            borderColor: 'red',
            fill: false,
            hidden:true
          },
        ]
      },
      options: options
  });

}