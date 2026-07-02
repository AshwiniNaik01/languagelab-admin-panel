"use client";

import { useState } from "react";
import InputField from "./InputField";
import Button from "../ui/Button";
import { AlignLeft } from "lucide-react";

export default function SubTopicForm({ initialData = {}, topicTitle = "", onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const e = {};
    if (!data.title?.trim()) e.title = "Title is required";
    if (!data.description?.trim()) e.description = "Description is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      order: Number(formData.get("order")) || 1,
    };

    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    setLoading(true);
    try {
      await onSuccess(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl"
    >
      <div className="border-b border-orange-500/10 pb-4">
        <h3 className="text-xl font-black text-[#3C1E0A]">
          {initialData._id ? "Edit SubTopic" : "Create New SubTopic"}
        </h3>
        {topicTitle && (
          <p className="text-sm text-orange-600 font-bold mt-1">
            Topic: {topicTitle}
          </p>
        )}
      </div>

      {/* Title */}
      <InputField
        label="Title"
        name="title"
        placeholder="e.g. Introduction to Grammar"
        defaultValue={initialData.title}
        error={errors.title}
        required
        icon="BookMarked"
      />

      {/* Description */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Description <span className="text-orange-500 ml-1">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-3.5 text-orange-400 pointer-events-none">
            <AlignLeft size={16} strokeWidth={2} />
          </span>
          <textarea
            name="description"
            defaultValue={initialData.description}
            rows={4}
            placeholder="Brief overview of this subtopic…"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-200 text-sm resize-none ${
              errors.description
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            }`}
          />
        </div>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      {/* Order */}
      <div className="max-w-xs">
        <InputField
          label="Order"
          name="order"
          type="number"
          placeholder="1"
          defaultValue={initialData.order ?? 1}
          error={errors.order}
          icon="ListOrdered"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : initialData._id ? "Update SubTopic" : "Create SubTopic"}
        </Button>
      </div>
    </form>
  );
}
