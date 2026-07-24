"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../layouts/EditorLayout";
import CourseForm from "../../../components/form/CourseForm";
import { createEditorCourse } from "../../../services/editorPanel";

export default function EditorAddCoursePage() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      await createEditorCourse(data);
      Swal.fire({ icon: "success", title: "Course Created", timer: 1500, showConfirmButton: false });
      router.push("/editor/courses");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      const is409 = err?.response?.status === 409;
      Swal.fire({
        icon: "error",
        title: is409 ? "Course Code Already Exists" : "Creation Failed",
        text: is409 ? "A course with this code already exists. Please use a different course code." : msg,
      });
    }
  };

  return (
    <EditorLayout>
      <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
        <CourseForm onSuccess={handleSubmit} onCancel={() => router.push("/editor/courses")} />
      </div>
    </EditorLayout>
  );
}
