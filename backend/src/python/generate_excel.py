from io import BytesIO
from openpyxl import Workbook
from openpyxl.chart import ScatterChart, Reference, Series
from openpyxl.chart.text import RichText
from openpyxl.drawing.text import  RichTextProperties,Paragraph,ParagraphProperties, CharacterProperties
import json
import sys

if not sys.argv[1]:
  raise ValueError("Arguments not included")

generated_data = json.loads(sys.argv[1])
measurements = generated_data["measurements"]
filter_measurements = generated_data["filter_measurements"]
segmentation = generated_data["segmentation"]
slopes = generated_data["slopes"]
singularities = generated_data["abnormalities"]

distance = measurements["distance"]

slope_values: map = map(lambda item : 
                    list(map(lambda value : item[value], item)), 
                    slopes)

wb = Workbook()
virtual_workbook = BytesIO()

ws2 = wb.create_sheet('Datos')

ws = wb.active

ws.title = "Iri de segmentación dinámico"

ws["A1"] = "ID"
ws["B1"] = measurements["id"]

ws["A2"] = "Inicio"
ws["B2"] = "Fin"
ws["C2"] = "IRI"

# ws["D2"] = "Filtrado"
# ws["E2"] = "Segmentación"

ws["E2"] = "Inicio Segmento"
ws["F2"] = "Fin Segmento"
ws["G2"] = "IRI"
ws["I2"] = "Puntos Singulares"

ws2["A1"] = "Medicion"
# ws2["B1"] = "Puntos Zk"
# ws2["C1"] = "Puntos Singulares"

length = len(measurements["measurements"]) + 2

# Medidas generales
for idx, measurement in enumerate(measurements["measurements"]):
  row_val = idx+3
  new_measurement = str(measurement)[:-3] + '+' + str(measurement)[-3:]
  new_final_measurement = measurement + (measurements["distance"])
  new_final_measurement = str(new_final_measurement)[:-3] + '+' + str(new_final_measurement)[-3:]
  ws2.cell(row=row_val, column=1, value=measurement)
  ws.cell(row=row_val, column=1, value=new_measurement)
  ws.cell(row=row_val, column=2, value=new_final_measurement)
  ws.cell(row=row_val, column=3, value=measurements["iri"][idx])

slope_values = list(slope_values)

# Gráfica 2: pendiente
for idx, value in enumerate(slope_values):
  row_val = idx+3 
  ws.cell(row=row_val, column=5, value=value[0])
  ws.cell(row=row_val, column=6, value=value[1])
  ws.cell(row=row_val, column=7, value=value[2])

# Segmentación por medio de IRI
# last = None
# idx = 2
# for i in slope_values:
#   idx += 1
#   for j in range(i[0], i[1], distance):
#     ws2.cell(row=idx, column=2, value=i[2])
#     idx += 1

# Puntos singulares
idx = 0
singularities_length = len(singularities)
for i in range(len(measurements["measurements"])):
  if (idx >= singularities_length):
    break
  
  if (measurements["measurements"][i] == singularities[idx]["x"]):
    ws.cell(row=idx+3, column=9, value=singularities[idx]["x"])
    ws.cell(row=idx+3, column=10, value=singularities[idx]["y"])
    # ws2.cell(row=i+1, column=3, value=singularities[idx]["y"])
    idx += 1
  # else:
  #   ws2.cell(row=i+1, column=3, value=None)

c1 = ScatterChart()
c1.title = "IRI segmentado"
c1.style = 2
c1.y_axis.title = "IRI"
c1.x_axis.title = "Metros"
c1.x_axis.scaling.min = measurements["measurements"][0]
c1.x_axis.scaling.max = measurements["measurements"][-1]
c1.x_axis.scaling.orientation = "minMax"

c1.x_axis.majorUnit = round(len(measurements["measurements"]) / 5)

measurement_values = Reference(ws2, min_col=1, min_row=3, max_row=length)
iri = Reference(ws, min_col=3, min_row=3, max_row=length)
x_singular_points = Reference(ws, min_col=9, min_row=1, max_row=singularities_length)
y_singular_points = Reference(ws, min_col=10, min_row=1, max_row=singularities_length)

segmentation_length = len(slope_values)

x_segmentation_series = []
y_segmentation_series = []
for i in range(segmentation_length):
  x_segmentation_series
  y_segmentation_series.append(Reference(ws, min_col=7, min_row=i+3))

iri_series = Series(values=iri, xvalues=measurement_values, title ="IRI")
singular_points = Series(values=y_singular_points, xvalues=x_singular_points, title="Puntos singulares")

c1.series.append(singular_points)
c1.series.append(iri_series)
# segmentation_data = Reference(ws, min_col=4, min_row=2, max_row=length)

c1.width = 25
c1.height = 12

s = c1.series[0]
s.marker.symbol = "circle"
s.marker.graphicalProperties.solidFill = "FF0000"
s.marker.graphicalProperties.line.solidFill = "FF0000"
s.graphicalProperties.line.noFill = True

s = c1.series[1]

s.graphicalProperties.line.solidFill = "4444FF"


c1.x_axis.txPr = RichText(bodyPr=RichTextProperties(anchor="ctr",anchorCtr="1",rot="-2700000",
           spcFirstLastPara="1",vertOverflow="ellipsis",wrap="square"),
        p=[Paragraph(pPr=ParagraphProperties(defRPr=CharacterProperties()), endParaRPr=CharacterProperties())])

ws.add_chart(c1, "L2")

# wb.save("chart.xlsx")
wb.save(virtual_workbook)

sys.stdout.buffer.write(virtual_workbook.getvalue())

# sys.stdout.flush()