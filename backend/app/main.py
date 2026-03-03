from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .db import Base, engine, get_db
from . import models, schemas
from .services.parsers import extract_text_from_upload
from .services.llm import summarize_with_gemini

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Study Buddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/syllabus")
def upload_syllabus(payload: schemas.SyllabusIn, db: Session = Depends(get_db)):
    db.query(models.Syllabus).delete()
    record = models.Syllabus(content=payload.content)
    db.add(record)
    db.commit()
    return {"message": "Syllabus saved"}


@app.post("/syllabus/file")
async def upload_syllabus_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    data = await file.read()
    extracted = extract_text_from_upload(file.filename, data)
    if not extracted:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    db.query(models.Syllabus).delete()
    record = models.Syllabus(content=extracted)
    db.add(record)
    db.commit()
    return {"message": "Syllabus saved"}


@app.get("/syllabus")
def get_syllabus(db: Session = Depends(get_db)):
    record = db.query(models.Syllabus).first()
    return {"content": record.content if record else ""}


@app.post("/summarize")
def summarize_text(payload: schemas.SummarizeRequest, db: Session = Depends(get_db)):
    if not payload.text:
        raise HTTPException(status_code=400, detail="text is required")
    syllabus = db.query(models.Syllabus).first()
    result = summarize_with_gemini(payload.text, syllabus.content if syllabus else None, payload.prompt)
    return {"summary": result}


@app.post("/summarize/file")
async def summarize_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    data = await file.read()
    extracted = extract_text_from_upload(file.filename, data)
    if not extracted:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    syllabus = db.query(models.Syllabus).first()
    result = summarize_with_gemini(extracted, syllabus.content if syllabus else None)
    return {"summary": result}


@app.post("/notes")
def create_note(payload: schemas.NoteIn, db: Session = Depends(get_db)):
    note = models.Note(title=payload.title, content=payload.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return {"id": note.id}


@app.get("/notes")
def list_notes(db: Session = Depends(get_db)):
    notes = db.query(models.Note).order_by(models.Note.id.desc()).all()
    return [{"id": n.id, "title": n.title, "content": n.content} for n in notes]


@app.put("/notes/{note_id}")
def update_note(note_id: int, payload: schemas.NoteIn, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Not found")
    note.title = payload.title
    note.content = payload.content
    db.commit()
    return {"message": "updated"}


@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(note)
    db.commit()
    return {"message": "deleted"}
