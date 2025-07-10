import { Request, Response } from "express";

// @ts-ignore
import XLSXChart from "xlsx-chart";
const xlsxChart = new XLSXChart();

export function create_chart(req: Request, res: Response) {
  console.log("Session details", req.session.generated_data);

  var opts = {
    file: "chart.xlsx",
    chart: "column",
    titles: ["Title 1", "Title 2", "Title 3"],
    fields: ["Field 1", "Field 2", "Field 3", "Field 4"],
    data: {
      "Title 1": {
        "Field 1": 5,
        "Field 2": 10,
        "Field 3": 15,
        "Field 4": 20,
      },
      "Title 2": {
        "Field 1": 10,
        "Field 2": 5,
        "Field 3": 20,
        "Field 4": 15,
      },
      "Title 3": {
        "Field 1": 20,
        "Field 2": 15,
        "Field 3": 10,
        "Field 4": 5,
      },
    },
  };

  xlsxChart.generate(opts, function (err: any, result: any) {
    if (err) {
      console.error("ERRROR: ", err);
      res.status(500).send(`ERROR: ${err}`);
      return;
    }

    res.status(200);
  });
  //   res
  //     .status(200)
  //     .setHeader(
  //       "Content-Disposition",
  //       'attachment; filename="iri_segmentado.xlsx"'
  //     )
  //     .setHeader("Content-Type", "application/octet-stream")
  //     .send(result);
  // });
}
