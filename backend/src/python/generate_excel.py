from io import BytesIO
from openpyxl import load_workbook
import json
import sys

from components.homogenous_segmentation import homogenous_segmentation
from components.worksheet_generator import generate_sheet

dynamic_segmentation = input()
generated_data = json.loads(dynamic_segmentation)

satic_segmentation = input()
static_data = json.loads(satic_segmentation)

hsegment = input()
h_segmentation = json.loads(hsegment)

wb = load_workbook("./src/python/template.xlsm", keep_vba=True)
virtual_workbook = BytesIO()

for gd in generated_data:
    key = list(gd.keys())[0]
    values = list(gd.values())[0]["generated_data"]
    generate_sheet(wb, key, values)

# for sd in static_data:
#     key = list(gd.keys())[0]
#     values = list(gd.values())[0]["generated_data"]
#     generate_sheet(wb, key, values)

homogenous_segmentation(wb, h_segmentation)

if "Sheet" in wb.sheetnames:
    del wb["Sheet"]

if "Hoja1" in wb.sheetnames:
    del wb["Hoja1"]

wb.save(virtual_workbook)

sys.stdout.buffer.write(virtual_workbook.getvalue())
