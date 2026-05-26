# Quickstart: Task Hierarchy and Comments

## Prerequisites

- Python 3.11 with the project virtual environment activated
- Node.js installed for the frontend

## Backend

1. Activate the virtual environment.
2. Install backend dependencies if needed.
3. Run database migrations.
4. Start the API server.

Example commands:

```bash
cd backend
alembic upgrade head
uvicorn src.main:app --reload
```

## Frontend

1. Install frontend dependencies if needed.
2. Start the Vite development server.

Example commands:

```bash
cd frontend
npm install
npm run dev
```

## Verification

Run the automated tests for both tiers:

```bash
cd backend
pytest

cd ../frontend
npm test
```

## Manual checks

1. Open the task list and confirm main tasks render.
2. Create a task on the dedicated create page.
3. Open the dedicated edit page for a task.
4. Add subtasks and confirm a done main task blocks further subtask mutations.
5. Add comments, switch the comment order, and reload to confirm the preference is preserved locally.
