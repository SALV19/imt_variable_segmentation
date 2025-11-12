from openpyxl import Workbook


def homogenous_segmentation(wb: Workbook, h_segmentation):
    ws = wb.create_sheet("Segmentos Homogeneos")

    ws.cell(row=2, column=2, value="Inicio")
    ws.cell(row=2, column=3, value="Fin")

    base_col = 4

    for idx, value in enumerate(h_segmentation):
        row_val = idx + 3
        ws.cell(row=row_val, column=2, value=value["start"])
        ws.cell(row=row_val, column=3, value=value["end"])

        counter = base_col
        for key, val in value["values"].items():
            # write header once (when idx == 0)
            if idx == 0:
                ws.cell(row=2, column=counter, value=key)
            ws.cell(row=row_val, column=counter, value=(val + 1))
            counter += 1
