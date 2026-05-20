import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TaskPage from "../../src/pages/TaskPage";

const mockUseTasksQuery = vi.fn();
const mockCreateTask = vi.fn();
const mockUpdateStatus = vi.fn();
const mockUpdateDetails = vi.fn();
const mockDeleteTask = vi.fn();
const mockUseDeleteTaskMutation = vi.fn();

vi.mock("../../src/services/tasks", () => ({
  useTasksQuery: () => mockUseTasksQuery(),
  useCreateTaskMutation: () => ({
    mutateAsync: mockCreateTask,
    isPending: false,
  }),
  useUpdateTaskStatusMutation: () => ({
    mutateAsync: mockUpdateStatus,
    isPending: false,
    variables: undefined,
  }),
  useUpdateTaskDetailsMutation: () => ({
    mutateAsync: mockUpdateDetails,
    isPending: false,
    variables: undefined,
  }),
  useDeleteTaskMutation: () => mockUseDeleteTaskMutation(),
}));

function renderPage() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskPage />
    </QueryClientProvider>
  );
}

describe("Task delete flow", () => {
  beforeEach(() => {
    mockCreateTask.mockReset();
    mockUpdateStatus.mockReset();
    mockUpdateDetails.mockReset();
    mockDeleteTask.mockReset();
    mockUseDeleteTaskMutation.mockReset();

    mockUseDeleteTaskMutation.mockReturnValue({
      mutateAsync: mockDeleteTask,
      isPending: false,
      variables: undefined,
    });

    mockUseTasksQuery.mockReturnValue({
      items: [
        {
          id: "task-1",
          title: "Delete candidate",
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

    mockDeleteTask.mockResolvedValue(undefined);
  });

  it("opens confirmation modal before deleting", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByRole("dialog", { name: "Delete task" })).toBeInTheDocument();
    expect(mockDeleteTask).not.toHaveBeenCalled();
  });

  it("cancels delete and keeps task unchanged", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel delete" }));

    expect(screen.queryByRole("dialog", { name: "Delete task" })).not.toBeInTheDocument();
    expect(mockDeleteTask).not.toHaveBeenCalled();
  });

  it("confirms delete and triggers delete mutation", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith({ taskId: "task-1" });
    });
  });

  it("shows empty state when there are no tasks", () => {
    mockUseTasksQuery.mockReturnValue({
      items: [],
      hasMore: false,
      nextCursor: null,
      isLoading: false,
      isError: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    });

    renderPage();

    expect(screen.getByText("No tasks yet.")).toBeInTheDocument();
  });
});
