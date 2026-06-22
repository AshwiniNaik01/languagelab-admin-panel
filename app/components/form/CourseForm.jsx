"use client";

import InputField from "./InputField";
import Button from "../ui/Button";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CourseForm({
  initialData = {},
  onCancel,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Course Data:", data);

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
      <h3 className="text-lg font-bold">
        {initialData._id ? "Edit Course" : "Create Course"}
      </h3>

      <InputField
        label="Course Name"
        name="course_name"
        defaultValue={initialData.course_name}
        required
      />

      <InputField
        label="Course Code"
        name="course_code"
        defaultValue={initialData.course_code}
        required
      />

      <InputField
        label="Duration"
        name="duration"
        defaultValue={initialData.duration}
        placeholder="e.g. 3 Months"
      />

      <div>
        <label className="block mb-2 text-sm font-semibold">
          Description
        </label>

        <textarea
          name="description"
          defaultValue={initialData.description}
          rows={4}
          className="w-full border rounded-lg p-3"
        />
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