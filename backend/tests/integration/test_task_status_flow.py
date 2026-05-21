from __future__ import annotations

from fastapi.testclient import TestClient


def test_status_updates_persist_across_reads(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={
            "title": "Prepare release",
            "description": "",
            "status": "todo",
        },
    )
    task_id = created.json()["id"]

    updated = client.patch(
        f"/tasks/{task_id}",
        json={"status": "done"},
    )
    assert updated.status_code == 200
    assert updated.json()["status"] == "done"

    fetched = client.get(f"/tasks/{task_id}")
    assert fetched.status_code == 200
    assert fetched.json()["status"] == "done"

    second_update = client.patch(
        f"/tasks/{task_id}",
        json={"status": "in_progress"},
    )
    assert second_update.status_code == 200
    assert second_update.json()["status"] == "in_progress"
