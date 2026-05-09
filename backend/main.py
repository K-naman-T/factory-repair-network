import uuid
from datetime import datetime
from pathlib import Path

import edge_tts
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from twilio.twiml.voice_response import VoiceResponse

from backend.database import get_connection, init_db
from backend.intent import classify_intent
from backend.models import JobCreate


ADMIN_PASSWORD = "admin123"
TTS_VOICE = "en-IN-NatashaNeural"
TTS_DIR = Path(__file__).resolve().parents[1] / "tts_audio"
TTS_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Factory Repair Network MVP")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/tts", StaticFiles(directory=TTS_DIR), name="tts")


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.post("/webhook/twilio")
async def twilio_webhook(request: Request):
    form = await request.form()
    phone = form.get("From", "unknown")
    transcript = form.get("SpeechResult") or form.get("Body") or "Need urgent repair assistance"
    intent = classify_intent(transcript)

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO call_logs(phone, intent, transcript, created_at) VALUES(?, ?, ?, ?)",
        (phone, intent, transcript, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()

    message = f"Thank you. Your {intent} issue is registered. A technician will contact you shortly."
    filename = f"{uuid.uuid4()}.mp3"
    output = TTS_DIR / filename
    communicator = edge_tts.Communicate(text=message, voice=TTS_VOICE)
    await communicator.save(str(output))

    response = VoiceResponse()
    response.play(str(request.base_url).rstrip("/") + f"/tts/{filename}")

    return PlainTextResponse(str(response), media_type="application/xml")


@app.get("/api/technicians")
def get_technicians(specialty: str = Query(default=""), city: str = Query(default="")):
    conn = get_connection()
    cur = conn.cursor()
    query = "SELECT * FROM technicians WHERE 1=1"
    params: list[str] = []

    if specialty:
        query += " AND specialty = ?"
        params.append(specialty)
    if city:
        query += " AND city = ?"
        params.append(city)

    cur.execute(query, params)
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return rows


@app.post("/api/jobs")
def create_job(payload: JobCreate):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM factories WHERE id = ?", (payload.factory_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Factory not found")

    technician_id = payload.technician_id
    if technician_id is None:
        cur.execute(
            "SELECT id FROM technicians WHERE specialty = ? AND available = 1 ORDER BY rating DESC LIMIT 1",
            (payload.specialty_needed,),
        )
        found = cur.fetchone()
        technician_id = found["id"] if found else None

    now = datetime.utcnow().isoformat()
    cur.execute(
        """
        INSERT INTO jobs(factory_id, technician_id, specialty_needed, status, created_at, resolved_at, cost)
        VALUES(?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload.factory_id,
            technician_id,
            payload.specialty_needed,
            payload.status,
            now,
            now if payload.status == "resolved" else None,
            payload.cost,
        ),
    )
    job_id = cur.lastrowid
    conn.commit()

    cur.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    created = dict(cur.fetchone())
    conn.close()
    return JSONResponse(created)


@app.get("/api/jobs")
def list_jobs():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM jobs ORDER BY created_at DESC")
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return rows


@app.get("/api/stats")
def get_stats(admin_password: str = Query(default="")):
    if admin_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin password")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) AS c FROM factories")
    total_factories = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(*) AS c FROM technicians")
    total_technicians = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(*) AS c FROM jobs")
    total_jobs = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(*) AS c FROM jobs WHERE status = 'open'")
    open_jobs = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(*) AS c FROM jobs WHERE status = 'resolved'")
    resolved_jobs = cur.fetchone()["c"]
    cur.execute("SELECT specialty_needed, COUNT(*) AS c FROM jobs GROUP BY specialty_needed")
    jobs_by_specialty = {row["specialty_needed"]: row["c"] for row in cur.fetchall()}

    conn.close()
    return {
        "total_factories": total_factories,
        "total_technicians": total_technicians,
        "total_jobs": total_jobs,
        "open_jobs": open_jobs,
        "resolved_jobs": resolved_jobs,
        "jobs_by_specialty": jobs_by_specialty,
    }
