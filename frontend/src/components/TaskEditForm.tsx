import { FormEvent, useState } from "react";

type TaskEditFormProps = {
  initialTitle: string;
  initialDescription: string;
  onSave: (payload: { title: string; description: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
};

function TaskEditForm({
  initialTitle,
  initialDescription,
  onSave,
  onCancel,
  isSubmitting,
}: TaskEditFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Title is required.");
      return;
    }

    setError(null);
    await onSave({ title: cleanTitle, description: description.trim() });
  };

  return (
    <form className="task-edit-form" onSubmit={handleSubmit}>
      <label htmlFor="edit-task-title">Edit title</label>
      <input
        id="edit-task-title"
        aria-label="Edit title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={255}
        disabled={isSubmitting}
      />

      <label htmlFor="edit-task-description">Edit description</label>
      <textarea
        id="edit-task-description"
        aria-label="Edit description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        maxLength={4000}
        disabled={isSubmitting}
      />

      {error ? <p className="error">{error}</p> : null}

      <div className="task-edit-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskEditForm;
