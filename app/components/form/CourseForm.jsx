"use client";

import { useState } from "react";
import InputField from "./InputField";
import Button from "../ui/Button";
import { courseSchema } from "../../schemas/course.schema.js";
import { BookOpen, AlignLeft } from "lucide-react";

export default function CourseForm({ initialData = {}, onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.duration_days) data.duration_days = Number(data.duration_days);

    try {
      await courseSchema.validate(data, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((e) => { validationErrors[e.path] = e.message; });
      } else {
        validationErrors[err.path] = err.message;
      }
      setErrors(validationErrors);
      return;
    }

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
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {initialData._id ? "Edit Course Information" : "Create New Course"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Course Name"
          name="course_name"
          placeholder="e.g. Business English"
          defaultValue={initialData.course_name}
          error={errors.course_name}
          icon="BookOpen"
        />
        <InputField
          label="Course Code"
          name="course_code"
          placeholder="e.g. BENG01"
          defaultValue={initialData.course_code}
          error={errors.course_code}
          icon="Hash"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Level <span className="text-orange-500 ml-1">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
              <BookOpen size={16} strokeWidth={2} />
            </span>
            <select
              name="level"
              defaultValue={initialData.level || ""}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-700 outline-none transition-all duration-200 text-sm ${
                errors.level
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
            >
              <option value="" disabled>Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level}</p>}
        </div>

        <InputField
          label="Language"
          name="language"
          placeholder="e.g. English"
          defaultValue={initialData.language}
          error={errors.language}
          icon="Globe"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Duration (days)"
          name="duration_days"
          type="number"
          placeholder="e.g. 365"
          defaultValue={initialData.duration_days}
          error={errors.duration_days}
          icon="Clock"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
        <div className="relative">
          <span className="absolute left-3.5 top-3.5 text-orange-400 pointer-events-none">
            <AlignLeft size={16} strokeWidth={2} />
          </span>
          <textarea
            name="description"
            defaultValue={initialData.description}
            rows={3}
            placeholder="Brief description of the course"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-200 text-sm resize-none ${
              errors.description
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            }`}
          />
        </div>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : initialData._id ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
