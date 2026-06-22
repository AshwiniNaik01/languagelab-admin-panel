"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import LicenseForm from "../../components/form/LicenseForm";
import { initialLicenses, initialInstitutes } from "../../services/dbService";

export default function NewLicensePage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    const current = JSON.parse(localStorage.getItem("lab_licenses") || JSON.stringify(initialLicenses));
    const newLic = {
      _id: "lic_" + Date.now(),
      ...data,
      active_sessions: 0,
      purchased_by: "superadmin_1",
      llm_metadata: {
        model_used: data.model_used || "Open LLM",
        llm_used: true,
        time_ms: Number(data.time_ms || 120),
        key_pattern: "HMAC_SIGNED",
        signature: data.signature || "0xSIGN"
      }
    };
    localStorage.setItem("lab_licenses", JSON.stringify([...current, newLic]));
    router.push("/licenses");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Generate License</h2>
          <p className="text-sm text-slate-500">Generate HMAC signatures and seat counts for affiliate institute systems.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
          <LicenseForm institutes={initialInstitutes} onSubmit={handleSubmit} onCancel={() => router.push("/licenses")} />
        </div>
      </div>
    </AdminLayout>
  );
}
