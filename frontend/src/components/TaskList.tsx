import type { Task } from "../lib/task_adapter";
import TaskListItem from "./TaskListItem";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

type TaskListProps = {
  items: Task[];
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onStatusChange: (payload: { taskId: string; status: Task["status"] }) => void;
  onTaskEdit: (payload: {
    taskId: string;
    title: string;
    description: string;
    status: Task["status"];
  }) => Promise<void>;
  onTaskDelete: (payload: { taskId: string }) => Promise<void>;
  updatingTaskId: string | null;
  editingTaskId: string | null;
  deletingTaskId: string | null;
};

function TaskList({
  items,
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  onStatusChange,
  onTaskEdit,
  onTaskDelete,
  updatingTaskId,
  editingTaskId,
  deletingTaskId,
}: TaskListProps) {
  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-white/90">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
            <CardTitle className="text-2xl">Tasks</CardTitle>
          </div>
          <p className="text-sm text-slate-500">
            {items.length} {items.length === 1 ? "task" : "tasks"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">No tasks yet.</p>
            <p className="mt-1 text-sm text-slate-500">Create one on the left to start building your list.</p>
          </div>
        ) : null}
        <ul className="space-y-3">
          {items.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              isUpdating={updatingTaskId === task.id}
              isEditing={editingTaskId === task.id}
              isDeleting={deletingTaskId === task.id}
            />
          ))}
        </ul>

        {canLoadMore ? (
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="w-full border-slate-300 bg-white hover:bg-slate-50"
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default TaskList;
