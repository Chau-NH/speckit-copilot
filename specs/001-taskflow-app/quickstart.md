# Quickstart: TaskFlow Application

## Prerequisites

- Python 3.11+
- Node.js 20+
- npm 10+

## Project Structure

- `backend/` - FastAPI REST service with SQLite persistence
- `frontend/` - React web app consuming backend API

## 1) Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Windows Git Bash
pip install -r requirements.txt
alembic upgrade head
# Keep frontend and backend hostnames consistent (localhost vs 127.0.0.1)
# or configure CORS_ORIGINS explicitly for local development.
# Example:
# export CORS_ORIGINS="http://127.0.0.1:5173,http://localhost:5173"
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

Backend API docs should be available at `http://127.0.0.1:8000/docs`.

## 2) Frontend Setup

```bash
cd frontend
npm install
# Match the backend host form above to avoid origin mismatch.
# Example: VITE_API_BASE_URL=http://127.0.0.1:8000
npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend should be available at `http://127.0.0.1:5173`.

### Frontend UI Components (shadcn/ui)

The frontend uses shadcn/ui components for improved accessibility and consistency:

- **Button**: Primary, outline, destructive, ghost variants
- **Input**: Text field with Tailwind styling
- **Textarea**: Multi-line input with auto-height support
- **Select**: Dropdown with Radix UI primitive and Tailwind theming
- **Dialog**: Modal with accessible title/description
- **Card**: Container with header, title, description, content, footer sub-components

Components are located in `frontend/src/ui/` and use:

- **Tailwind CSS** for utility-based styling
- **Radix UI primitives** for accessible component behavior
- **class-variance-authority** for component variant management
- **lucide-react** for icons (Trash, Edit, Plus)

All component props remain stable; styling changes are internal only.

## 3) Test-First Workflow

Follow strict Red-Green-Refactor for each feature slice:

1. Write failing tests first.
2. Confirm failures.
3. Implement minimum code to pass.
4. Refactor while keeping tests green.

### Backend tests

```bash
cd backend
source .venv/Scripts/activate
pytest
```

### Frontend tests

```bash
cd frontend
npm test
```

## 4) API Contract

Use the OpenAPI contract at `specs/001-taskflow-app/contracts/openapi.yaml` as the source of truth for frontend-backend integration.

## 5) Security and Performance Checks

- Verify task title rendering is plain text only (no executable markup).
- Measure API CRUD p95 latency under local load and keep below 200 ms.
- Validate UI responsiveness with at least 100 tasks in list.

## 6) Validation Status

Last verified on 2026-05-20 with:

- Backend: `PYTHONPATH=. pytest` from `backend/` - 19 passed
- Frontend: `npm test` from `frontend/` - 6 passed
