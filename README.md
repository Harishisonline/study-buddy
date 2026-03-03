# Study Buddy

A student-friendly web app to summarize notes, chat with your syllabus, and save study canvases.

## Tech Stack
- Frontend: React (Vite)
- Backend: FastAPI (Python)
- Database: PostgreSQL (Render)
- OCR: Tesseract
- LLM: Gemini

## Local Development

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE` in `frontend/.env` to your backend URL.

## Deployment
Use `render.yaml` to deploy both frontend and backend on Render.
