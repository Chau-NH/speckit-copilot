from __future__ import annotations

from fastapi.testclient import TestClient


def test_delete_task_returns_204_and_removes_task(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={
            "title": "Delete me",
            "description": "",
            "status": "todo",
        },
    )
    task_id = created.json()["id"]

    response = client.delete(f"/tasks/{task_id}")

    assert response.status_code == 204
    assert response.content == b""

    fetch_deleted = client.get(f"/tasks/{task_id}")
    assert fetch_deleted.status_code == 404
    assert fetch_deleted.json()["detail"] == "Task not found."


def test_delete_task_returns_404_for_unknown_task(client: TestClient) -> None:
    response = client.delete("/tasks/00000000-0000-0000-0000-000000000000")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found."
