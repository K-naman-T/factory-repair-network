import asyncio
import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Optional
from uuid import uuid4

import edge_tts
from fastapi import FastAPI, Form, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "factory_repair.db"
TTS_DIR = BASE_DIR / "static" / "tts"
ADMIN_PASSWORD = "factory123"

TTS_DIR.mkdir(parents=True, exist_ok=True)


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def classify_intent(text: str) -> str:
    if not text:
        return "Unknown"

    text = text.lower()
    intent_map = {
        "HVAC": ["ac", "ac repair", "cooling", "temperature", "refrigerant"],
        "Plumbing": ["plumb", "leak", "pipe", "water", "bathroom"],
        "Electrical": ["electric", "wire", "power", "short circuit"],
        "Pest Control": ["pest", "cockroach", "rat", "termite", "insects"],
        "Industrial Repair": ["machine", "industrial", "conveyor", "motor", "gear"],
    }

    for intent, keywords in intent_map.items():
        if any(keyword in text for keyword in keywords):
            return intent
    return "Unknown"


def init_db() -> None:
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS factories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            phone TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS technicians (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL,
            city TEXT NOT NULL,
            phone TEXT NOT NULL,
            available INTEGER DEFAULT 1,
            rating REAL DEFAULT 4.5
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            factory_id INTEGER,
            technician_id INTEGER,
            specialty_needed TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            resolved_at TEXT,
            cost REAL DEFAULT 0,
            FOREIGN KEY(factory_id) REFERENCES factories(id),
            FOREIGN KEY(technician_id) REFERENCES technicians(id)
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS call_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT,
            intent TEXT,
            transcript TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    conn.commit()

    cur.execute("SELECT COUNT(*) as count FROM factories")
    if cur.fetchone()["count"] == 0:
        seed_db(cur)
        conn.commit()

    conn.close()


def seed_db(cur: sqlite3.Cursor) -> None:
    factories = [
        ("Tata Vendor ForgeWorks", "Adityapur Industrial Area", "Jamshedpur", "+919876540001"),
        ("SteelFlow Components", "Bistupur Main Road", "Jamshedpur", "+919876540002"),
        ("Dhanbad Heavy Parts", "Bank More Industrial Block", "Dhanbad", "+919876540003"),
        ("Ranchi Precision Motors", "Kokar Industrial Estate", "Ranchi", "+919876540004"),
        ("Bokaro Conveyor Systems", "Sector 4 Plant Zone", "Bokaro", "+919876540005"),
    ]
    cur.executemany(
        "INSERT INTO factories (name, address, city, phone) VALUES (?, ?, ?, ?)",
        factories,
    )

    technicians = [
        ("Rajesh Kumar", "HVAC", "Jamshedpur", "+919820000001", 1, 4.8),
        ("Sanjay Patel", "HVAC", "Ranchi", "+919820000002", 1, 4.6),
        ("Imran Ali", "Plumbing", "Dhanbad", "+919820000003", 1, 4.4),
        ("Vikash Singh", "Plumbing", "Bokaro", "+919820000004", 0, 4.5),
        ("Amit Das", "Electrical", "Jamshedpur", "+919820000005", 1, 4.7),
        ("Neeraj Sahu", "Electrical", "Ranchi", "+919820000006", 1, 4.3),
        ("Prakash M", "Industrial Repair", "Bokaro", "+919820000007", 1, 4.9),
        ("Rohit Verma", "Industrial Repair", "Dhanbad", "+919820000008", 1, 4.6),
        ("Mohan Yadav", "Pest Control", "Ranchi", "+919820000009", 1, 4.2),
        ("Anil Gupta", "Pest Control", "Jamshedpur", "+919820000010", 0, 4.1),
    ]
    cur.executemany(
        """
        INSERT INTO technicians (name, specialty, city, phone, available, rating)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        technicians,
    )

    sample_jobs = []
    statuses = ["pending", "assigned", "in_progress", "completed"]
    specialties = ["HVAC", "Plumbing", "Electrical", "Industrial Repair", "Pest Control"]
    costs = {
        "HVAC": 1400,
        "Plumbing": 600,
        "Electrical": 900,
        "Industrial Repair": 4200,
        "Pest Control": 750,
    }
    for i in range(20):
        specialty = specialties[i % len(specialties)]
        status = statuses[i % len(statuses)]
        factory_id = (i % 5) + 1
        technician_id = (i % 10) + 1
        resolved = datetime.now().isoformat() if status == "completed" else None
        sample_jobs.append(
            (
                factory_id,
                technician_id,
                specialty,
                status,
                resolved,
                costs[specialty] + (i * 50),
            )
        )

    cur.executemany(
        """
        INSERT INTO jobs (factory_id, technician_id, specialty_needed, status, resolved_at, cost)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        sample_jobs,
    )


class IntentPayload(BaseModel):
    text: str


class JobCreatePayload(BaseModel):
    factory_id: int
    specialty_needed: str
    city: str


class TechnicianCreatePayload(BaseModel):
    name: str
    specialty: str
    city: str
    phone: str
    available: int = 1
    rating: float = 4.5


class FactoryCreatePayload(BaseModel):
    name: str
    address: str
    city: str
    phone: str


app = FastAPI(title="Factory Repair Network MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


@app.on_event("startup")
def startup() -> None:
    init_db()


async def synthesize_tts(message: str) -> Optional[str]:
    try:
        filename = f"{uuid4().hex}.mp3"
        path = TTS_DIR / filename
        voice = edge_tts.Communicate(message, voice="en-IN-NeerjaNeural")
        await voice.save(str(path))
        return f"/static/tts/{filename}"
    except Exception:
        return None


@app.post("/webhook/twilio")
async def twilio_webhook(
    request: Request,
    From: str = Form(default="Unknown"),
    SpeechResult: str = Form(default=""),
) -> Response:
    transcript = SpeechResult.strip()
    intent = classify_intent(transcript)

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO call_logs (phone, intent, transcript) VALUES (?, ?, ?)",
        (From, intent, transcript),
    )

    city = "Jamshedpur"
    cur.execute(
        """
        SELECT * FROM technicians
        WHERE specialty = ? AND city = ? AND available = 1
        ORDER BY rating DESC
        LIMIT 1
        """,
        (intent, city),
    )
    tech = cur.fetchone()

    if tech:
        response_text = (
            f"We've found a technician for {intent} in {city}. "
            f"{tech['name']} will arrive within 2 hours."
        )
    else:
        response_text = "We have received your request and will call you back shortly with technician details."

    conn.commit()
    conn.close()

    audio_path = await synthesize_tts(response_text)
    base_url = str(request.base_url).rstrip("/")

    if audio_path:
        twiml = f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<Response>
    <Play>{base_url}{audio_path}</Play>
</Response>"""
    else:
        twiml = f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<Response>
    <Say>{response_text}</Say>
</Response>"""

    return Response(content=twiml, media_type="application/xml")


@app.post("/api/intent")
def classify(payload: IntentPayload):
    return {"intent": classify_intent(payload.text)}


@app.get("/api/technicians")
def get_technicians(
    specialty: Optional[str] = Query(default=None),
    city: Optional[str] = Query(default=None),
):
    conn = get_conn()
    cur = conn.cursor()

    query = "SELECT * FROM technicians WHERE available = 1"
    params = []
    if specialty:
        query += " AND specialty = ?"
        params.append(specialty)
    if city:
        query += " AND city = ?"
        params.append(city)

    cur.execute(query, params)
    data = [dict(row) for row in cur.fetchall()]
    conn.close()
    return data


@app.post("/api/jobs")
def create_job(payload: JobCreatePayload):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id FROM technicians
        WHERE specialty = ? AND city = ? AND available = 1
        ORDER BY rating DESC
        LIMIT 1
        """,
        (payload.specialty_needed, payload.city),
    )
    tech = cur.fetchone()
    if not tech:
        conn.close()
        raise HTTPException(status_code=404, detail="No available technician found")

    cur.execute(
        """
        INSERT INTO jobs (factory_id, technician_id, specialty_needed, status)
        VALUES (?, ?, ?, 'assigned')
        """,
        (payload.factory_id, tech["id"], payload.specialty_needed),
    )
    job_id = cur.lastrowid
    conn.commit()
    conn.close()
    return {"job_id": job_id, "technician_id": tech["id"], "status": "assigned"}


@app.get("/api/jobs")
def list_jobs():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT jobs.*, factories.name as factory_name, technicians.name as technician_name
        FROM jobs
        LEFT JOIN factories ON jobs.factory_id = factories.id
        LEFT JOIN technicians ON jobs.technician_id = technicians.id
        ORDER BY jobs.created_at DESC
        """
    )
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


@app.get("/api/jobs/{job_id}")
def get_job(job_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    job = cur.fetchone()
    conn.close()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return dict(job)


@app.get("/api/stats")
def get_stats():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) as total FROM call_logs")
    total_calls = cur.fetchone()["total"]
    cur.execute("SELECT COUNT(*) as total FROM jobs")
    total_jobs = cur.fetchone()["total"]
    cur.execute("SELECT COALESCE(SUM(cost), 0) as revenue FROM jobs WHERE status = 'completed'")
    revenue = cur.fetchone()["revenue"]
    conn.close()
    return {"total_calls": total_calls, "total_jobs": total_jobs, "revenue": revenue}


@app.get("/api/calls")
def list_calls():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM call_logs ORDER BY created_at DESC")
    calls = [dict(row) for row in cur.fetchall()]
    conn.close()
    return calls


@app.get("/api/factories")
def list_factories():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM factories ORDER BY created_at DESC")
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return rows


@app.post("/api/factories")
def add_factory(payload: FactoryCreatePayload, password: str = Query(default="")):
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin password")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO factories (name, address, city, phone) VALUES (?, ?, ?, ?)",
        (payload.name, payload.address, payload.city, payload.phone),
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return {"id": new_id}


@app.post("/api/technicians")
def add_technician(payload: TechnicianCreatePayload, password: str = Query(default="")):
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin password")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO technicians (name, specialty, city, phone, available, rating)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            payload.name,
            payload.specialty,
            payload.city,
            payload.phone,
            payload.available,
            payload.rating,
        ),
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return {"id": new_id}


@app.get("/health")
def health():
    return JSONResponse({"status": "ok", "service": "factory-repair-network"})
