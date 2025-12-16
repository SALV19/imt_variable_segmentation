from openpyxl import worksheet
from openpyxl.chart import Reference, Series


def get_singular_points(ws: worksheet, singularities_length: int):
    x_singular_points = Reference(
        ws, min_col=9, min_row=3, max_row=singularities_length + 2
    )
    y_singular_points = Reference(
        ws, min_col=10, min_row=3, max_row=singularities_length + 2
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
