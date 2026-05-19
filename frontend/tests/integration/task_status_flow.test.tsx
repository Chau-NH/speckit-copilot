import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TaskPage from "../../src/pages/TaskPage";

const mockUseTasksQuery = vi.fn();
const mockUpdateStatus = vi.fn();
const mockCreateTask = vi.fn();
const mockUseUpdateTaskStatusMutation = vi.fn();

vi.mock("../../src/services/tasks", () => ({
  useTasksQuery: () => mockUseTasksQuery(),
  useCreateTaskMutation: () => ({
    mutateAsync: mockCreateTask,
    isPending: false,
  }),
  useUpdateTaskStatusMutation: () => mockUseUpdateTaskStatusMutation(),
  useUpdateTaskDetailsMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    variables: undefined,
  }),
}));

function renderPage() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskPage />
    </QueryClientProvider>
  );
}

describe("Task status flow", () => {
  beforeEach(() => {
    mockCreateTask.mockReset();
    mockUpdateStatus.mockReset();
    mockUseUpdateTaskStatusMutation.mockReset();

    mockUseUpdateTaskStatusMutation.mockReturnValue({
      mutateAsync: mockUpdateStatus,
      isPending: false,
      variables: undefined,
    });

    mockUseTasksQuery.mockReturnValue({
      items: [
        {
          id: "task-1",
          title: "Ship release",
          description: "",
          status: "todo",
          createdAt: "2026-05-18T10:00:00Z",
          updatedAt: "2026-05-18T10:00:00Z",
        },
      ],
      hasMore: false,
      nextCursor: null,
      isLoading: false,
      isError: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    });
    mockUpdateStatus.mockResolvedValue({
      id: "task-1",
      title: "Ship release",
      description: "",
      status: "done",
      createdAt: "2026-05-18T10:00:00Z",
      updatedAt: "2026-05-18T10:10:00Z",
    });
  });

  it("shows a status selector and saves updates", async () => {
    renderPage();

    const statusSelect = screen.getByLabelText("Status");
    fireEvent.change(statusSelect, { target: { value: "done" } });

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith({ taskId: "task-1", status: "done" });
    });
  });

  it("keeps status selector enabled when update is no longer pending", () => {
    mockUseUpdateTaskStatusMutation.mockReturnValue({
      mutateAsync: mockUpdateStatus,
      isPending: false,
      variables: { taskId: "task-1", status: "done" },
    });

    renderPage();

    const statusSelect = screen.getByLabelText("Status");
    expect(statusSelect).toBeEnabled();
  });
});
