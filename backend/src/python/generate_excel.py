from io import BytesIO
from openpyxl import Workbook
from openpyxl.chart import (
  LineChart, Reference
)
import json
import sys

if not sys.argv[1]:
  raise ValueError("Arguments not included")

generated_data = json.loads(sys.argv[1])
measurements = generated_data["measurements"]
filter_measurements = generated_data["filter_measurements"]
segmentation = generated_data["segmentation"]
slopes = generated_data["slopes"]
slope_values = map(lambda item : 
                    list(map(lambda value : item[value], item)), 
                    slopes)

wb = Workbook()
virtual_workbook = BytesIO()

ws2 = wb.create_sheet('Segmentacion')

ws = wb.active

ws.title = "Iri de segmentación dinámico"

ws["A1"] = "ID"
ws["B1"] = measurements["id"]

ws["A2"] = "Inicio"
ws["B2"] = "Fin"
ws["C2"] = "IRI"

ws["D2"] = "Filtrado"
ws["E2"] = "Segmentación"

ws["G2"] = "Inicio Segmento"
ws["H2"] = "Fin Segmento"
ws["I2"] = "IRI"

ws2["A1"] = "Segmentacion"

length = len(measurements["measurements"]) + 2

for idx, measurement in enumerate(measurements["measurements"]):
  row_val = idx+3
  ws.cell(row=row_val, column=1, value=measurement)
  ws.cell(row=row_val, column=2, value=(measurement + measurements["distance"]))
  ws.cell(row=row_val, column=3, value=measurements["iri"][idx])
  ws.cell(row=row_val, column=4, value=filter_measurements[idx])
  ws.cell(row=row_val, column=5, value=segmentation[idx])


for idx, value in enumerate(slope_values):
  row_val = idx+3 
  ws.cell(row=row_val, column=7, value=value[0])
  ws.cell(row=row_val, column=8, value=value[1])
  ws.cell(row=row_val, column=9, value=value[2])

# last = None
# iri_segmentatio_values = list(slope_values)
# i = 0
# for idx, _ in enumerate(measurements["measurements"]):
#   _iri = iri_segmentatio_values
#   if last != _iri: 
#     last = _iri
#     i += 1
#   ws.cell(row=idx+2, column=6 , value=last)


c1 = LineChart()
c1.title = "IRI segmentado"
c1.style = 2
c1.y_axis.title = "IRI"
c1.x_axis.title = "Metros"

measurement_values = Reference(ws, min_col=1, max_col=1, min_row=2, max_row=length)
iri = Reference(ws, min_col=3, max_col=3, min_row=2, max_row=length)
filter_data = Reference(ws, min_col=4, max_col=4, min_row=2, max_row=length)
segmentation_data = Reference(ws, min_col=5, max_col=5, min_row=2, max_row=length)
# slopes_data = Reference(ws2, min_col=9, max_col=9, min_row=3, max_row=length)

c1.add_data(iri, titles_from_data=True)
c1.add_data(filter_data, titles_from_data=True)
c1.set_categories(measurement_values)
c1.width = 25
c1.height = 12
ws.add_chart(c1, "K2")

c2 = LineChart()
c2.title = "IRI segmentado"
c2.style = 2
c2.y_axis.title = "IRI segmentado"
c2.x_axis.title = "Metros"

c2.add_data(segmentation_data, titles_from_data=True)
c2.set_categories(measurement_values)
c2.width = 25
c2.height =12
ws.add_chart(c2, "K24")

wb.save(virtual_workbook)

sys.stdout.buffer.write(virtual_workbook.getvalue())

# sys.stdout.flush()