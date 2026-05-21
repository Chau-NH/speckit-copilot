import axios from "axios";

export function normalizeCursor(cursor: string | null | undefined): string | undefined {
  const trimmed = cursor?.trim();
  return trimmed ? trimmed : undefined;
}

export function getTaskListErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as { detail?: unknown } | string | undefined;
    const detail = typeof responseData === "string" ? responseData : responseData?.detail;

    if (status === 422 && typeof detail === "string" && detail.toLowerCase().includes("invalid cursor")) {
      return "That task list cursor is invalid. Refresh the page to load the latest tasks.";
    }
  }

  return "Unable to load tasks.";
}
