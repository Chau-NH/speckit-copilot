import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TaskPage from "../../src/pages/TaskPage";

const mockUseTasksQuery = vi.fn();
const mockCreateTask = vi.fn();
const mockUpdateStatus = vi.fn();
const mockUpdateDetails = vi.fn();
const mockUseUpdateTaskDetailsMutation = vi.fn();

vi.mock("../../src/services/tasks", () => ({
  useTasksQuery: () => mockUseTasksQuery(),
  useCreateTaskMutation: () => ({
    mutateAsync: mockCreateTask,
    isPending: false,
  }),
  useUpdateTaskStatusMutation: () => ({
    mutateAsync: mockUpdateStatus,
    isPending: false,
  }),
  useUpdateTaskDetailsMutation: () => mockUseUpdateTaskDetailsMutation(),
  useDeleteTaskMutation: () => ({
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

describe("Task edit flow", () => {
  beforeEach(() => {
    mockCreateTask.mockReset();
    mockUpdateStatus.mockReset();
    mockUpdateDetails.mockReset();
    mockUseUpdateTaskDetailsMutation.mockReset();

    mockUseUpdateTaskDetailsMutation.mockReturnValue({
      mutateAsync: mockUpdateDetails,
      isPending: false,
      variables: undefined,
    });

    mockUseTasksQuery.mockReturnValue({
      items: [
        {
          id: "task-1",
          title: "Buy gorceries",
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
    mockUpdateDetails.mockResolvedValue({
      id: "task-1",
      title: "Buy groceries",
      description: "Weekly shopping",
      status: "todo",
      createdAt: "2026-05-18T10:00:00Z",
      updatedAt: "2026-05-18T10:10:00Z",
    });
  });

  it("saves edited title and description", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Edit title"), { target: { value: "Buy groceries" } });
    fireEvent.change(screen.getByLabelText("Edit description"), { target: { value: "Weekly shopping" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockUpdateDetails).toHaveBeenCalledWith({
        taskId: "task-1",
        title: "Buy groceries",
        description: "Weekly shopping",
        status: "todo",
      });
    });
  });

  it("cancels editing and restores view mode without saving", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Edit title"), { target: { value: "Temporary" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Buy gorceries")).toBeInTheDocument();
    expect(mockUpdateDetails).not.toHaveBeenCalled();
  });

  it("keeps Edit enabled when update is no longer pending", () => {
    mockUseUpdateTaskDetailsMutation.mockReturnValue({
      mutateAsync: mockUpdateDetails,
      isPending: false,
      variables: { taskId: "task-1" },
    });

    renderPage();

    const editButton = screen.getByRole("button", { name: "Edit" });
    expect(editButton).toBeEnabled();
  });
});
