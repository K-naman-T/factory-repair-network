# Factory Repair Network MVP

Fast MVP for dispatching industrial repair technicians in Indian factory hubs.

## Stack
- FastAPI backend (`main.py`) on port `8000`
- SQLite database (`factory_repair.db`)
- Twilio voice webhook at `/webhook/twilio`
- Edge TTS (`edge-tts`) for spoken response generation
- React + Vite admin dashboard in `frontend/` on port `5173`

## Backend setup
```bash
python3 -m venv .venv
.venv/bin/pip install fastapi uvicorn edge-tts python-multipart
.venv/bin/uvicorn main:app --reload --port 8000
```

## Frontend setup
```bash
cd frontend
npm install
npm run dev
```

## Admin routes
- `/admin` login (MVP hardcoded password check)
- `/admin/calls`
- `/admin/jobs`
- `/admin/technicians`
- `/admin/factories`

Default admin password in backend: `factory123`

## API endpoints
- `POST /webhook/twilio`
- `POST /api/intent`
- `GET /api/technicians?specialty=X&city=Y`
- `POST /api/jobs`
- `GET /api/jobs/{id}`
- `GET /api/stats`
- `GET /api/calls`
- `GET /api/jobs`
- `GET/POST /api/technicians`
- `GET/POST /api/factories`
