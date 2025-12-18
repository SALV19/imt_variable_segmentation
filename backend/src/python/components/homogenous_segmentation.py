from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.chart.text import RichText, Text
from openpyxl.chart.title import Title
from openpyxl.chart.layout import Layout, ManualLayout
from openpyxl.drawing.text import (
    Paragraph,
    ParagraphProperties,
    RegularTextRun,
    CharacterProperties,
    Font as PlotFont,
)
from openpyxl.chart import ScatterChart


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

    series = {}
    for idx, (parameter, position_value) in enumerate(parameters.items()):
        # cell = ws.cell(row=2, column=18 + idx * 2 + 1, value=parameter)
        # cell.font = Font(color="FFFFFF")
        x_series_cells = []
        idx_series_cell = []
        for parameter_idx, (position, value) in enumerate(position_value):
            position_cell = ws.cell(
                row=parameter_idx + 3, column=18 + idx * 2, value=position
            )
            position_cell.font = Font(color="FFFFFF")

            idx_cell = ws.cell(
                row=parameter_idx + 3, column=18 + idx * 2 + 1, value=idx + 1
            )
            idx_cell.font = Font(color="FFFFFF")

            x_series_cells.append(position_cell)
            idx_series_cell.append(idx_cell)

        series["parameter"] = {
            "x_series_cells": x_series_cells,
            "idx_series_cell": idx_series_cell,
        }

    chart = ScatterChart()

    # Chart customization
    chart.style = 2
    chart.y_axis.delete = True
    chart.roundedCorners = False

    char_props = CharacterProperties(
        sz=1400,
        solidFill="BBBBBB",
        latin=PlotFont(typeface="Roboto"),
    )

    paragraph = Paragraph(
        pPr=ParagraphProperties(defRPr=char_props),
        r=[RegularTextRun(t="Segmentación Homogenea")],
    )

    rich_text = RichText(p=[paragraph])
    text = Text(rich=rich_text)
    chart.title = Title(text)

    chart.legend.position = "b"
    chart.legend.layout = Layout(
        manualLayout=ManualLayout(
            x=0.4,
            y=0.95,
        )
    )

    ws.add_chart(chart, "M2")
