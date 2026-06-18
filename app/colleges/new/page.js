"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import CollegeForm from "../../components/form/CollegeForm";
import { initialColleges } from "../../services/dbService";

export default function NewCollegePage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    // Read current colleges, append, and save
    const current = JSON.parse(localStorage.getItem("lab_colleges") || JSON.stringify(initialColleges));
    const newCollege = {
      _id: "col_" + Date.now(),
      ...data,
      teachers: [],
      created_by: "superadmin_1"
    };
    localStorage.setItem("lab_colleges", JSON.stringify([...current, newCollege]));
    router.push("/colleges");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
      

        
          <CollegeForm onSubmit={handleSubmit} onCancel={() => router.push("/colleges")} />
        
      </div>
    </AdminLayout>
  );
}
