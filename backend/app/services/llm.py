import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def summarize_with_gemini(text: str, syllabus_context: str | None = None, prompt: str | None = None) -> str:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set")
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    system = (
        "You are Study Buddy, a student-friendly summarizer. "
        "Write simple, clear notes with headings and bullet points. "
        "Always ground answers to the provided syllabus if present. "
        "Keep it concise and easy to study."
    )

    user_prompt = "Summarize the following content."
    if prompt:
        user_prompt = prompt

    parts = [system]
    if syllabus_context:
        parts.append(f"SYLLABUS CONTEXT:\n{syllabus_context}")
    parts.append(f"CONTENT:\n{text}")
    parts.append(user_prompt)

    response = model.generate_content("\n\n".join(parts))
    return response.text.strip()
