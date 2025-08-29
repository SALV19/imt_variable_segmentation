from openpyxl.chart import ScatterChart, Reference, Series
from openpyxl.chart.text import RichText
from openpyxl import Workbook
from openpyxl.chart.series import SeriesLabel
from openpyxl.drawing.text import (
    RichTextProperties,
    Paragraph,
    ParagraphProperties,
    CharacterProperties,
)
from openpyxl.styles import Font


def generate_sheet(wb: Workbook, title: str, generated_data):
    measurements = generated_data["measurements"]
    filter_measurements = generated_data["filter_measurements"]
    segmentation = generated_data["segmentation"]
    slopes = generated_data["slopes"]
    singularities = generated_data["abnormalities"]

    distance = measurements["distance"]

    slope_values: map = map(
        lambda item: list(map(lambda value: item[value], item)), slopes
    )

    ws = wb.create_sheet(title)

    ws["A1"] = "ID"
    ws["B1"] = measurements["id"]

    ws["A2"] = "Inicio"
    ws["B2"] = "Fin"
    ws["C2"] = title.upper()

    ws["E2"] = "Inicio Segmento"
    ws["F2"] = "Fin Segmento"
    ws["G2"] = title.upper()
    ws["I2"] = "Puntos Singulares"

    length = len(measurements["measurements"]) + 2

    # Medidas generales
    for idx, measurement in enumerate(measurements["measurements"]):
        row_val = idx + 3
        end_measurement = measurement + measurements["distance"]
        measurement_cell = ws.cell(row=row_val, column=1, value=measurement)
        end_measurement_cell = ws.cell(row=row_val, column=2, value=end_measurement)
        measurement_cell.number_format = '0"+"000'
        end_measurement_cell.number_format = '0"+"000'
        ws.cell(row=row_val, column=3, value=measurements["iri"][idx])

    slope_values = list(slope_values)

    # Gráfica 2: pendiente
    for idx, value in enumerate(slope_values):
        row_val = idx + 3
        ws.cell(row=row_val, column=5, value=value[0])
        ws.cell(row=row_val, column=6, value=value[1])
        ws.cell(row=row_val, column=7, value=value[2])
        cell = ws.cell(row=row_val, column=8, value=value[2])
        cell.font = Font(color="FFFFFF")

    # Puntos singulares
    idx = 0
    singularities_length = len(singularities)
    for i in range(len(measurements["measurements"])):
        if idx >= singularities_length:
            break

        if measurements["measurements"][i] == singularities[idx]["x"]:
            ws.cell(row=idx + 3, column=9, value=singularities[idx]["x"])
            ws.cell(row=idx + 3, column=10, value=singularities[idx]["y"])
            idx += 1

    c1 = ScatterChart()
    c1.title = f"{title.upper()} segmentado"
    c1.style = 2
    c1.y_axis.title = title.upper()
    c1.x_axis.title = "Metros"
    c1.x_axis.scaling.min = measurements["measurements"][0]
    c1.x_axis.scaling.max = measurements["measurements"][-1]
    c1.x_axis.scaling.orientation = "minMax"
    c1.x_axis.number_format = '0"+"000'

    c1.x_axis.majorUnit = round(len(measurements["measurements"]) / 5)

    measurement_values = Reference(ws, min_col=1, min_row=3, max_row=length)

    iri = Reference(ws, min_col=3, min_row=3, max_row=length)

    iri_series = Series(values=iri, xvalues=measurement_values, title=title.upper())
    iri_series.graphicalProperties.line.solidFill = "4444FF"

    def get_singular_points():
        x_singular_points = Reference(
            ws, min_col=9, min_row=1, max_row=singularities_length
        )
        y_singular_points = Reference(
            ws, min_col=10, min_row=1, max_row=singularities_length
        )

        singular_points = Series(
            values=y_singular_points,
            xvalues=x_singular_points,
            title="Puntos singulares",
        )
        singular_points.marker.symbol = "circle"
        singular_points.marker.graphicalProperties.solidFill = "FF0000"
        singular_points.marker.graphicalProperties.line.solidFill = "FF0000"
        singular_points.graphicalProperties.line.noFill = True
        return singular_points

    if singularities_length:
        singular_points = get_singular_points()

        c1.series.append(singular_points)

    for i in range(len(slope_values)):
        x_segmentation_series = Reference(ws, min_col=5, max_col=6, min_row=i + 3)
        y_segmentation_series = Reference(ws, min_col=7, max_col=8, min_row=i + 3)
        segmentation_series = Series(
            values=y_segmentation_series,
            xvalues=x_segmentation_series,
            title="Segmentos",
        )
        segmentation_series.graphicalProperties.line.solidFill = "000000"
        c1.series.append(segmentation_series)

    c1.series.append(iri_series)

    c1.width = 30
    c1.height = 15

    c1.x_axis.txPr = RichText(
        bodyPr=RichTextProperties(
            anchor="ctr",
            anchorCtr="1",
            rot="-2700000",
            spcFirstLastPara="1",
            vertOverflow="ellipsis",
            wrap="square",
        ),
        p=[
            Paragraph(
                pPr=ParagraphProperties(defRPr=CharacterProperties()),
                endParaRPr=CharacterProperties(),
            )
        ],
    )

    ws.add_chart(c1, "L2")
