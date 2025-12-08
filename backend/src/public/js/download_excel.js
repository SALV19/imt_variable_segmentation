// $("#chart_title").on("change", (e) => {
//   const $title = e.target.value;
//   const title = $title ? `?title=${$title}` : "";
//   $("#download_excel").attr("action", `/create_chart${title}`);
// });

$("#download_excel").on("submit", (e) => {
  e.preventDefault();

  const $title = $("#chart_title")[0].value;
  const title = $title ? `?title=${$title}` : "";
  fetch(`/create_chart${title}`)
    .then((res) => {
      const filename =
        res.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || "download.xlsx";

      return res.blob().then((blob) => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
});
