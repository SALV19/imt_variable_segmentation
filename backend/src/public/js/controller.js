function handleJSON(json_response) {
  if (json_response.error) {
    console.log("Show Modal");
    $("#modal").show();
    $("#error_text").text(json_response.error);
    $("#param").text(json_response.param);
    return;
  }

  Object.keys(json_response).forEach((_idx, key) => {
    create_data(
      Object.values(json_response[key])[0].generated_data,
      Object.keys(json_response[key])[0]
    );
  });
}
