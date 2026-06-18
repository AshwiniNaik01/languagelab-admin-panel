"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import TeacherForm from "../../components/form/TeacherForm";
import { initialTeachers, initialColleges } from "../../services/dbService";

export default function NewTeacherPage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    const current = JSON.parse(localStorage.getItem("lab_teachers") || JSON.stringify(initialTeachers));
    const newTeacher = {
      _id: "teach_" + Date.now(),
      ...data,
      role: "teacher",
      created_by: "superadmin_1"
    };
    localStorage.setItem("lab_teachers", JSON.stringify([...current, newTeacher]));
    router.push("/teachers");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Register Teacher</h2>
          <p className="text-sm text-slate-500">Create a new teacher profile and assign them to specific affiliated college nodes.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
          <TeacherForm colleges={initialColleges} onSubmit={handleSubmit} onCancel={() => router.push("/teachers")} />
        </div>
      </div>
    </AdminLayout>
  );
}
