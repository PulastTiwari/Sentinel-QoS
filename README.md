# Project Sentinel-QoS

An AI-driven prototype for dynamic Quality of Service enforcement. This repository contains a Next.js frontend and a FastAPI backend that simulate classification of network flows and suggested QoS policies.

Quick start (local):

1. Start the Python backend

```bash
# Create a virtual env and activate it
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt  # ensure fastapi, uvicorn, etc.
python -m uvicorn orchestrator:app --reload --port 8000
```

2. Start the frontend

```bash
cd sentinel-qos-dashboard
pnpm install
pnpm dev
# or npm/yarn equivalent
```

3. Open http://localhost:3000

Environment variables
- `NEXT_PUBLIC_API_URL` (optional) — override backend URL (defaults to http://localhost:8000)

Contributing
Please read `CONTRIBUTING.md` for contribution guidelines and `CODE_OF_CONDUCT.md` for community expectations.
