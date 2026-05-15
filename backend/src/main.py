from fastapi import FastAPI

from src.api.routes.tasks import router as tasks_router
from src.repositories.db import init_db

app = FastAPI(title="TaskFlow API", version="0.1.0")
app.include_router(tasks_router)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
