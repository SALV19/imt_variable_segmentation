from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.chart import ScatterChart, Reference, Series
from openpyxl.chart.error_bar import ErrorBars


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
        for key, val in value["parameters"].items():
            # write header once (when idx == 0)
            if idx == 0:
                ws.cell(row=2, column=counter, value=key.capitalize())
            ws.cell(row=row_val, column=counter, value=val)

            counter += 1

    # Create matrix of segments
    parameters = {}
    for segment_idx, segment in enumerate(h_segmentation):
        for idx, (parameter, value) in enumerate(segment["parameters"].items()):
            if segment_idx == 0:
                parameters[parameter] = [(segment["start"], value)]
            elif segment_idx < len(h_segmentation) - 1:
                if parameters[parameter][-1][1] != value:
                    parameters[parameter].append((segment["end"], value))
            else:
                parameters[parameter].append((segment["end"], value))

    for idx, (parameter, position_value) in enumerate(parameters.items()):
        # cell = ws.cell(row=2, column=18 + idx * 2 + 1, value=parameter)
        # cell.font = Font(color="FFFFFF")
        for parameter_idx, (position, value) in enumerate(position_value):
            cell = ws.cell(row=parameter_idx + 3, column=18 + idx * 2, value=position)
            cell.font = Font(color="FFFFFF")
            cell = ws.cell(
                row=parameter_idx + 3, column=18 + idx * 2 + 1, value=idx + 1
            )
            cell.font = Font(color="FFFFFF")
