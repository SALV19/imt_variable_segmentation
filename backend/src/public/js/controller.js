function handleJSON(json_response) {
  Object.keys(json_response).forEach((_idx, key) => {
    create_data(
      Object.values(json_response[key])[0].generated_data,
      Object.keys(json_response[key])[0]
    );
  });
}
