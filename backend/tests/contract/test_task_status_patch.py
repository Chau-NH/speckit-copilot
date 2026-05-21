from __future__ import annotations

from fastapi.testclient import TestClient


def test_patch_task_status_updates_task(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={
            "title": "Write docs",
            "description": "",
            "status": "todo",
        },
    )
    task_id = created.json()["id"]

    response = client.patch(
        f"/tasks/{task_id}",
        json={"status": "in_progress"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == task_id
    assert payload["status"] == "in_progress"
    assert payload["title"] == "Write docs"
