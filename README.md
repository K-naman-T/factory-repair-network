# Factory Repair Network MVP

Minimal full-stack MVP for dispatching technicians to factory repair requests.

## Project Structure

- `backend/main.py` - FastAPI app and API endpoints
- `backend/models.py` - Pydantic request/response models
- `backend/database.py` - SQLite schema, initialization, and seeding
- `backend/intent.py` - keyword-based intent classification
- `frontend/index.html` - React SPA via CDN (no build step)
- `requirements.txt`

## Features

- Twilio webhook endpoint: `POST /webhook/twilio`
  - Classifies caller issue intent (HVAC, Plumbing, Electrical, Pest, Industrial)
  - Generates voice response with `edge-tts` using `en-IN-NatashaNeural`
  - Returns TwiML with audio playback URL
- Technician lookup: `GET /api/technicians?specialty=X&city=Y`
- Job creation: `POST /api/jobs`
- Job listing: `GET /api/jobs`
- Admin stats: `GET /api/stats?admin_password=admin123`

## Local Run

1. Install dependencies:

```bash
pip3 install -r requirements.txt
```

2. Start backend:

```bash
python3 -m uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0
```

3. Open frontend in browser:

`frontend/index.html`

## Seeded Data

- 5 factories in: Jamshedpur, Dhanbad, Ranchi, Bokaro, Hazaribagh
- 10 technicians (2 per specialty)
- 20 sample jobs

## Admin Password

- `admin123`
