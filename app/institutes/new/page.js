"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import InstituteForm from "../../components/form/InstituteForm";
import { initialInstitutes } from "../../services/dbService";

export default function NewInstitutePage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    // Read current institutes, append, and save
    const current = JSON.parse(localStorage.getItem("lab_institutes") || JSON.stringify(initialInstitutes));
    const newInstitute = {
      _id: "col_" + Date.now(),
      ...data,
      editors: [],
      created_by: "superadmin_1"
    };
    localStorage.setItem("lab_institutes", JSON.stringify([...current, newInstitute]));
    router.push("/institutes");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
      

        
          <InstituteForm onSubmit={handleSubmit} onCancel={() => router.push("/institutes")} />
        
      </div>
    </AdminLayout>
  );
}
