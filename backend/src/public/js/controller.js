function handleJSON(dynamic_data, static_data) {
  if (dynamic_data.error) {
    console.log("Show Modal");
    $("#modal").show();
    $("#error_text").text(dynamic_data.error);
    $("#param").text(dynamic_data.param);
    return;
  }

  Object.keys(dynamic_data).forEach((key) => {
    create_data(
      Object.values(dynamic_data[key])[0].generated_data,
      Object.keys(dynamic_data[key])[0],
    );
  });

  Object.keys(static_data).forEach((_idx, key) => {
    create_simple_segmentation(
      Object.values(static_data[key])[0],
      Object.keys(static_data[key])[0],
    );
  });
}

function handleCheckboxChange(event) {
  if (event.checked && event.id.includes("_")) {
    specialInstruccions();
  }
}

function specialInstruccions() {
  $("#special-instructions").text(`Para los elementos de\n
    'Agrietamiento por fatiga', 'Agrietamiento longitudinal' o 'Agrietamiento transversal'\n
    Favor de utilizar los nombres 'AgrFatiga', 'GrLong' y 'GrTrans' al inicio 
    para el correcto funcionamiento de la aplicación`);
}
