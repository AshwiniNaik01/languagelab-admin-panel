"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import CourseForm from "../form/CourseForm";
import { createCourse } from "../../services/course";

export default function NewCourseContent() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    await createCourse(data);
    Swal.fire({ icon: "success", title: "Course Created", timer: 1500, showConfirmButton: false });
    router.push("/courses");
  };

  return (
    <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
      <CourseForm onSuccess={handleSubmit} onCancel={() => router.push("/courses")} />
    </div>
  );
}
