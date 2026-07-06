# React + FastAPI Ecommerce

A two-page ecommerce example featuring a React front end (CRA) and a FastAPI backend. The structure keeps the landing/home experience separate from the catalog and cart workflow while maintaining a cohesive visual language.

## Stack

- Frontend: React 18 + React Router + Create React App
- Backend: FastAPI with in-memory product and cart data
- Communication: REST endpoints with JSON payloads

## Project layout

- `backend/` – FastAPI service that exposes products, cart operations, checkout, and featured product data.
- `frontend/` – CRA React application with home and catalog pages, cart summary, and checkout form.

## Development

### Backend

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The React app expects the API to run at `http://localhost:8000` by default. Override the base URL via `REACT_APP_API_URL` if needed.

## Build

- Frontend: `npm run build` (from `frontend/`)
- Backend: package with your preferred tooling (Uvicorn/Gunicorn) pointed at `backend.main:app`.

## Notes

- Cart and inventory data live in memory and reset when the backend restarts.
- Checkout is simulated and responds with the submitted order details for easy frontend testing.
