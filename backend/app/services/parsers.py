import io
from typing import Optional
import pdfplumber
from docx import Document
from PIL import Image
import pytesseract


def parse_pdf(file_bytes: bytes) -> str:
    text = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text.append(page.extract_text() or "")
    return "\n".join(text).strip()


def parse_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join([p.text for p in doc.paragraphs]).strip()


def parse_txt(file_bytes: bytes) -> str:
    return file_bytes.decode(errors="ignore").strip()


def parse_image(file_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(file_bytes))
    return pytesseract.image_to_string(image)


def extract_text_from_upload(filename: str, file_bytes: bytes) -> Optional[str]:
    name = filename.lower()
    if name.endswith(".pdf"):
        return parse_pdf(file_bytes)
    if name.endswith(".docx"):
        return parse_docx(file_bytes)
    if name.endswith(".txt"):
        return parse_txt(file_bytes)
    if name.endswith((".png", ".jpg", ".jpeg", ".webp")):
        return parse_image(file_bytes)
    return None
