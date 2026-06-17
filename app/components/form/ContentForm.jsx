"use client";

import InputField from "./InputField";
import Button from "../ui/Button";

export default function ContentForm({ type = "topic", initialData = {}, onSubmit, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.order = Number(data.order || 0);
    data.is_active = data.is_active === "on" || data.is_active === true;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">
        {initialData._id ? `Edit ${type === "topic" ? "Topic" : "Subtopic"}` : `Create New ${type === "topic" ? "Topic" : "Subtopic"}`}
      </h3>

      {type === "subtopic" && (
        <InputField
          label="Parent Topic ID"
          name="topic_id"
          placeholder="Enter parent Topic ObjectId ref"
          defaultValue={initialData.topic_id}
          required
        />
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <InputField
            label={`${type === "topic" ? "Topic" : "Subtopic"} Title`}
            name="title"
            placeholder="e.g. Vowel Sounds & Diphthongs"
            defaultValue={initialData.title}
            required
          />
        </div>
        <InputField
          label="Display Order"
          name="order"
          type="number"
          defaultValue={initialData.order || 0}
          required
        />
      </div>

      <div className="w-full">
        <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initialData.description}
          placeholder="Topic/Subtopic description and learning goals"
          className="w-full px-4 py-3 rounded-xl border border-orange-300 focus:border-orange-500 focus:outline-none text-sm text-gray-700"
        />
      </div>

      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          name="is_active"
          id="content_is_active"
          defaultChecked={initialData.is_active !== false}
          className="accent-orange-500 w-4 h-4 rounded"
        />
        <label htmlFor="content_is_active" className="text-sm font-semibold text-gray-700">
          Mark Content as Active & Visible
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Content
        </Button>
      </div>
    </form>
  );
}
