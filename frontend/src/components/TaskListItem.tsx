import { useState } from "react";
import type { Task } from "../lib/task_adapter";
import TaskEditForm from "./TaskEditForm";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Trash2, Edit2 } from "lucide-react";

type TaskListItemProps = {
  task: Task;
  onStatusChange: (payload: { taskId: string; status: Task["status"] }) => void;
  onEdit: (payload: { taskId: string; title: string; description: string; status: Task["status"] }) => Promise<void>;
  onDelete: (payload: { taskId: string }) => Promise<void>;
  isUpdating: boolean;
  isEditing: boolean;
  isDeleting: boolean;
};

function TaskListItem({ task, onStatusChange, onEdit, onDelete, isUpdating, isEditing, isDeleting }: TaskListItemProps) {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleSave = async (payload: { title: string; description: string }) => {
    await onEdit({
      taskId: task.id,
      title: payload.title,
      description: payload.description,
      status: task.status,
    });
    setIsInEditMode(false);
  };

  const handleCancel = () => {
    setIsInEditMode(false);
  };

  const handleConfirmDelete = async () => {
    await onDelete({ taskId: task.id });
    setIsDeleteConfirmOpen(false);
  };

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {isInEditMode ? (
        <TaskEditForm
          initialTitle={task.title}
          initialDescription={task.description}
          onSave={handleSave}
          onCancel={handleCancel}
          isSubmitting={isEditing}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="space-y-2 min-w-0">
            <p className="text-base font-semibold leading-6 text-slate-950 break-words whitespace-pre-wrap">{task.title}</p>
            {task.description ? (
              <p className="text-sm leading-6 text-slate-600 break-words whitespace-pre-wrap">{task.description}</p>
            ) : null}
          </div>

          <div className="space-y-3 lg:justify-self-end lg:w-full lg:max-w-[18rem]">
            <div className="space-y-2">
              <label htmlFor={`task-status-${task.id}`} className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 block">
                Status
              </label>
              <Select
                value={task.status}
                onValueChange={(value) =>
                  onStatusChange({ taskId: task.id, status: value as Task["status"] })
                }
                disabled={isUpdating || isDeleting}
              >
                <SelectTrigger id={`task-status-${task.id}`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">todo</SelectItem>
                  <SelectItem value="in_progress">in_progress</SelectItem>
                  <SelectItem value="done">done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsInEditMode(true)}
                disabled={isUpdating || isEditing || isDeleting}
                className="min-w-24"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteConfirmOpen(true)}
                disabled={isUpdating || isEditing || isDeleting}
                className="min-w-24"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>

          <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete task</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Are you sure you want to delete this task? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  Cancel delete
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  Confirm delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </li>
  );
}

export default TaskListItem;
