import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
    <form className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="edit-task-title" className="text-sm font-medium text-slate-700">
          Edit title
        </label>
        <Input
          id="edit-task-title"
          aria-label="Edit title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={255}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-task-description" className="text-sm font-medium text-slate-700">
          Edit description
        </label>
        <Textarea
          id="edit-task-description"
          aria-label="Edit description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={4000}
          disabled={isSubmitting}
        />
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

export default TaskEditForm;
