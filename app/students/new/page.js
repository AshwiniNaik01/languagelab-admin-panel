"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import StudentForm from "../../components/form/StudentForm";
import { initialStudents, initialColleges, initialLicenses } from "../../services/dbService";

export default function NewStudentPage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    const current = JSON.parse(localStorage.getItem("lab_students") || JSON.stringify(initialStudents));
    const newStudent = {
      _id: "stud_" + Date.now(),
      ...data,
      role: "student",
      is_active: true,
      status: "active"
    };
    localStorage.setItem("lab_students", JSON.stringify([...current, newStudent]));
    router.push("/students");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Register Student</h2>
          <p className="text-sm text-slate-500">Add a new student profile and allocate seats on current licenses.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
          <StudentForm colleges={initialColleges} licenses={initialLicenses} onSubmit={handleSubmit} onCancel={() => router.push("/students")} />
        </div>
      </div>
    </AdminLayout>
  );
}
