import os
from pypdf import PdfReader

file_path = r"C:\Users\Administrator\Desktop\midwork\work\开题报告1.1.pdf"
if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
else:
    reader = PdfReader(file_path)
    text = ""
    for i, page in enumerate(reader.pages):
        text += f"--- Page {i+1} ---\n"
        text += page.extract_text() + "\n"
    
    with open("pdf_content.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted to pdf_content.txt")
