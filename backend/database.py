import sqlite3
from datetime import datetime, timedelta
from pathlib import Path


DB_PATH = Path(__file__).resolve().parents[1] / "factory_repair.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS factories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            phone TEXT NOT NULL,
            created_at TEXT NOT NULL
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
            available INTEGER NOT NULL,
            rating REAL NOT NULL
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            factory_id INTEGER NOT NULL,
            technician_id INTEGER,
            specialty_needed TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            resolved_at TEXT,
            cost REAL NOT NULL,
            FOREIGN KEY(factory_id) REFERENCES factories(id),
            FOREIGN KEY(technician_id) REFERENCES technicians(id)
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS call_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT NOT NULL,
            intent TEXT NOT NULL,
            transcript TEXT,
            created_at TEXT NOT NULL
        )
        """
    )

    conn.commit()
    seed_data(conn)
    conn.close()


def seed_data(conn: sqlite3.Connection) -> None:
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) AS c FROM factories")
    if cur.fetchone()["c"] == 0:
        now = datetime.utcnow().isoformat()
        factories = [
            ("Tata Steel", "Jamshedpur Industrial Area", "Jamshedpur", "+91-657-1000001", now),
            ("Bhushan Steel", "Dhanbad Sector 7", "Dhanbad", "+91-326-1000002", now),
            ("JSW", "Ranchi Plant Road", "Ranchi", "+91-651-1000003", now),
            ("Bokaro Steel Plant", "Bokaro Main Gate", "Bokaro", "+91-6542-100004", now),
            ("Tata Steel", "Hazaribagh Unit Park", "Hazaribagh", "+91-6546-100005", now),
        ]
        cur.executemany(
            "INSERT INTO factories(name, address, city, phone, created_at) VALUES(?, ?, ?, ?, ?)",
            factories,
        )

    cur.execute("SELECT COUNT(*) AS c FROM technicians")
    if cur.fetchone()["c"] == 0:
        technicians = [
            ("Aman Singh", "HVAC", "Jamshedpur", "+91-9000001001", 1, 4.7),
            ("Nisha Das", "HVAC", "Ranchi", "+91-9000001002", 1, 4.5),
            ("Ravi Kumar", "Plumbing", "Dhanbad", "+91-9000001003", 1, 4.4),
            ("Meera Jain", "Plumbing", "Bokaro", "+91-9000001004", 0, 4.6),
            ("Arjun Patel", "Electrical", "Ranchi", "+91-9000001005", 1, 4.8),
            ("Pooja Roy", "Electrical", "Hazaribagh", "+91-9000001006", 1, 4.3),
            ("Sahil Ali", "Pest", "Dhanbad", "+91-9000001007", 1, 4.2),
            ("Kiran Sen", "Pest", "Jamshedpur", "+91-9000001008", 0, 4.1),
            ("Vikram Bose", "Industrial", "Bokaro", "+91-9000001009", 1, 4.9),
            ("Anita Verma", "Industrial", "Hazaribagh", "+91-9000001010", 1, 4.6),
        ]
        cur.executemany(
            "INSERT INTO technicians(name, specialty, city, phone, available, rating) VALUES(?, ?, ?, ?, ?, ?)",
            technicians,
        )

    cur.execute("SELECT COUNT(*) AS c FROM jobs")
    if cur.fetchone()["c"] == 0:
        jobs = []
        specialties = ["HVAC", "Plumbing", "Electrical", "Pest", "Industrial"]
        for idx in range(20):
            created_at = (datetime.utcnow() - timedelta(days=idx)).isoformat()
            specialty = specialties[idx % len(specialties)]
            status = "resolved" if idx % 3 == 0 else "open"
            resolved_at = (datetime.utcnow() - timedelta(days=max(idx - 1, 0))).isoformat() if status == "resolved" else None
            jobs.append(
                (
                    (idx % 5) + 1,
                    (idx % 10) + 1,
                    specialty,
                    status,
                    created_at,
                    resolved_at,
                    float(5000 + idx * 750),
                )
            )
        cur.executemany(
            """
            INSERT INTO jobs(factory_id, technician_id, specialty_needed, status, created_at, resolved_at, cost)
            VALUES(?, ?, ?, ?, ?, ?, ?)
            """,
            jobs,
        )

    conn.commit()
