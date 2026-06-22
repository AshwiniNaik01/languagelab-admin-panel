"use client";

import { useRouter } from "next/navigation";
import CourseForm from "../form/CourseForm";

export default function NewCourseContent() {
  const router = useRouter();

  const handleSubmit = (data) => {
    console.log("Course Data:", data);

    router.back();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Add Course
        </h2>

        <p className="text-sm text-slate-500">
          Create a new course.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
        <CourseForm
          onSuccess={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}