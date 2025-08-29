from io import BytesIO
from openpyxl import Workbook
import json
import sys

from components.worksheet_generator import generate_sheet


if not sys.argv[1]:
    raise ValueError("Arguments not included")

generated_data = json.loads(sys.argv[1])

wb = Workbook()
virtual_workbook = BytesIO()

for i in range(len(generated_data)):
    key = list(generated_data[i].keys())[0]
    values = list(generated_data[i].values())[0]["generated_data"]
    generate_sheet(wb, key, values)

if "Sheet" in wb.sheetnames:
    del wb["Sheet"]

wb.save(virtual_workbook)

sys.stdout.buffer.write(virtual_workbook.getvalue())
