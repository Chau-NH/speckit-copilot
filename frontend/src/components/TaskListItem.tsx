import { useState } from "react";
import type { Task } from "../lib/task_adapter";
import TaskEditForm from "./TaskEditForm";

type TaskListItemProps = {
  task: Task;
  onStatusChange: (payload: { taskId: string; status: Task["status"] }) => void;
  onEdit: (payload: { taskId: string; title: string; description: string; status: Task["status"] }) => Promise<void>;
  isUpdating: boolean;
  isEditing: boolean;
};

function TaskListItem({ task, onStatusChange, onEdit, isUpdating, isEditing }: TaskListItemProps) {
  const [isInEditMode, setIsInEditMode] = useState(false);

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

  return (
    <li className="task-item">
      {isInEditMode ? (
        <TaskEditForm
          initialTitle={task.title}
          initialDescription={task.description}
          onSave={handleSave}
          onCancel={handleCancel}
          isSubmitting={isEditing}
        />
      ) : (
        <>
          <p className="task-title">{task.title}</p>
          {task.description ? <p className="task-description">{task.description}</p> : null}
          <label className="task-status-control" htmlFor={`task-status-${task.id}`}>
            Status
            <select
              id={`task-status-${task.id}`}
              aria-label="Status"
              value={task.status}
              onChange={(event) =>
                onStatusChange({ taskId: task.id, status: event.target.value as Task["status"] })
              }
              disabled={isUpdating}
            >
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="done">done</option>
            </select>
          </label>
          <button type="button" onClick={() => setIsInEditMode(true)} disabled={isUpdating || isEditing}>
            Edit
          </button>
        </>
      )}
    </li>
  );
}

export default TaskListItem;
