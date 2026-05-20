import { describe, expect, it } from "vitest";
import { getTaskListErrorMessage, normalizeCursor } from "../../src/lib/task_pagination";

describe("task pagination helpers", () => {
  it("normalizes blank cursors to undefined", () => {
    expect(normalizeCursor(undefined)).toBeUndefined();
    expect(normalizeCursor(null)).toBeUndefined();
    expect(normalizeCursor("   ")).toBeUndefined();
    expect(normalizeCursor("cursor-123")).toBe("cursor-123");
  });

  it("maps invalid cursor errors to a friendly message", () => {
    const invalidCursorError = {
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          detail: "Invalid cursor.",
        },
      },
    };

    expect(getTaskListErrorMessage(invalidCursorError)).toBe(
      "That task list cursor is invalid. Refresh the page to load the latest tasks."
    );
  });

  it("falls back to a generic message for other failures", () => {
    expect(getTaskListErrorMessage(new Error("boom"))).toBe("Unable to load tasks.");
  });
});
