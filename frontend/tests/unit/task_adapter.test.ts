import { describe, expect, it } from "vitest";
import { adaptTask, adaptTaskPage } from "../../src/lib/task_adapter";

describe("task adapter", () => {
  it("adapts api task shapes to frontend task shapes", () => {
    expect(
      adaptTask({
        id: "task-1",
        title: "Ship release",
        description: "Final checks",
        status: "done",
        created_at: "2026-05-20T12:00:00Z",
        updated_at: "2026-05-20T12:05:00Z",
      })
    ).toEqual({
      id: "task-1",
      title: "Ship release",
      description: "Final checks",
      status: "done",
      createdAt: "2026-05-20T12:00:00Z",
      updatedAt: "2026-05-20T12:05:00Z",
    });
  });

  it("adapts api task pages and preserves pagination metadata", () => {
    expect(
      adaptTaskPage({
        items: [
          {
            id: "task-1",
            title: "Ship release",
            description: "",
            status: "todo",
            created_at: "2026-05-20T12:00:00Z",
            updated_at: "2026-05-20T12:05:00Z",
          },
        ],
        next_cursor: "cursor-123",
        has_more: true,
        limit: 20,
      })
    ).toEqual({
      items: [
        {
          id: "task-1",
          title: "Ship release",
          description: "",
          status: "todo",
          createdAt: "2026-05-20T12:00:00Z",
          updatedAt: "2026-05-20T12:05:00Z",
        },
      ],
      nextCursor: "cursor-123",
      hasMore: true,
      limit: 20,
    });
  });
});
