import type { Task } from "../lib/task_adapter";

type TaskListItemProps = {
  task: Task;
  onStatusChange: (payload: { taskId: string; status: Task["status"] }) => void;
  isUpdating: boolean;
};

function TaskListItem({ task, onStatusChange, isUpdating }: TaskListItemProps) {
  return (
    <li className="task-item">
      <p className="task-title">{task.title}</p>
      {task.description ? <p className="task-description">{task.description}</p> : null}
      <label className="task-status-control" htmlFor={`task-status-${task.id}`}>
        Status
        <select
          id={`task-status-${task.id}`}
          aria-label="Status"
          value={task.status}
          onChange={(event) => onStatusChange({ taskId: task.id, status: event.target.value as Task["status"] })}
          disabled={isUpdating}
        >
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
      </label>
    </li>
  );
}

export default TaskListItem;
