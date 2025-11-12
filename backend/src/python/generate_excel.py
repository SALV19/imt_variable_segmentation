from io import BytesIO
from openpyxl import load_workbook
import json
import sys

from components.homogenous_segmentation import homogenous_segmentation
from components.worksheet_generator import generate_sheet

data = input()
generated_data = json.loads(data)

hsegment = input()
h_segmentation = json.loads(hsegment)

wb = load_workbook("./src/python/template.xlsm", keep_vba=True)
virtual_workbook = BytesIO()

for i in range(len(generated_data)):
    key = list(generated_data[i].keys())[0]
    values = list(generated_data[i].values())[0]["generated_data"]
    generate_sheet(wb, key, values)

homogenous_segmentation(wb, h_segmentation)

if "Sheet" in wb.sheetnames:
    del wb["Sheet"]

if "Hoja1" in wb.sheetnames:
    del wb["Hoja1"]

wb.save(virtual_workbook)

sys.stdout.buffer.write(virtual_workbook.getvalue())
