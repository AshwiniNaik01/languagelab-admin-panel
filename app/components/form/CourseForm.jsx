"use client";

import InputField from "./InputField";
import Button from "../ui/Button";
import { useState } from "react";
import Swal from "sweetalert2";
import { courseSchema } from "../../schemas/course.schema.js";

export default function CourseForm({
  initialData = {},
  onCancel,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Course Data:", data);

    try {
      await courseSchema.validate(data, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      } else {
        validationErrors[err.path] = err.message;
      }
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: initialData._id
          ? "Course updated successfully"
          : "Course created successfully",
      });

      if (onSuccess) {
        onSuccess(data);
      }

      setLoading(false);
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border"
    >
      <h3 className="text-lg text-amber-900 font-bold">
        {initialData._id ? "Edit Course" : "Create Course"}
      </h3>

      <InputField
        label="Course Name"
        name="course_name"
        defaultValue={initialData.course_name}
        error={errors.course_name}

      />

      <InputField
        label="Course Code"
        name="course_code"
        defaultValue={initialData.course_code}
        error={errors.course_code}

      />

      <InputField
        label="Duration"
        name="duration"
        defaultValue={initialData.duration}
        placeholder="e.g. 3 Months"
        error={errors.duration}
      />

      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          defaultValue={initialData.description}
          rows={4}
          className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-200 ${
            errors.description
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialData._id
              ? "Update"
              : "Create"}
        </Button>
      </div>
    </form>
  );
}