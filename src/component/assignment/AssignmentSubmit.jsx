import { useState } from "react";

// Assignment Component
export const AssignmentSubmit = ({ assignment, onSubmit }) => {
  const [value, setValue] = useState(assignment?.submittedLink || "");
  const [description, setDescription] = useState(
    assignment?.submittedDescription || ""
  );

  const submit = () => {
    onSubmit({
      submitted: true,
      submittedLink: value,
      submittedDescription: description,
    });
  };

  return (
    <div className="mt-4 bg-white p-4 rounded shadow">
      <h3 className="font-semibold">Assignment</h3>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">
          Google Drive Link (or paste link)
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 block w-full border rounded p-2 focus:ring-brand-500"
        />
      </div>

      <div className="mt-3">
        <button
          onClick={submit}
          className="px-4 py-2 bg-brand-600 text-white rounded"
        >
          Submit Assignment
        </button>
      </div>
    </div>
  );
};