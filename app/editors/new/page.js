"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import EditorForm from "../../components/form/EditorForm";
import { initialEditors, initialInstitutes } from "../../services/dbService";

export default function NewEditorPage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    const current = JSON.parse(localStorage.getItem("lab_editors") || JSON.stringify(initialEditors));
    const newEditor = {
      _id: "teach_" + Date.now(),
      ...data,
      role: "editor",
      created_by: "superadmin_1"
    };
    localStorage.setItem("lab_editors", JSON.stringify([...current, newEditor]));
    router.push("/editors");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Register Editor</h2>
          <p className="text-sm text-slate-500">Create a new editor profile and assign them to specific affiliated institute nodes.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
          <EditorForm institutes={initialInstitutes} onSubmit={handleSubmit} onCancel={() => router.push("/editors")} />
        </div>
      </div>
    </AdminLayout>
  );
}
