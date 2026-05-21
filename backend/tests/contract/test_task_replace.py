from __future__ import annotations

from fastapi.testclient import TestClient


def test_put_task_updates_title_description_and_status(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={
            "title": "Buy gorceries",
            "description": "",
            "status": "todo",
        },
    )
    task_id = created.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "Buy groceries",
            "description": "Weekly shopping",
            "status": "in_progress",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == task_id
    assert payload["title"] == "Buy groceries"
    assert payload["description"] == "Weekly shopping"
    assert payload["status"] == "in_progress"


def test_put_task_returns_404_for_unknown_task(client: TestClient) -> None:
    response = client.put(
        "/tasks/00000000-0000-0000-0000-000000000000",
        json={
            "title": "Missing",
            "description": "",
            "status": "todo",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found."
