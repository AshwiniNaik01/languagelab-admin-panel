"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import LicenseForm from "../components/form/LicenseForm";
import { initialLicenses, initialInstitutes } from "../services/dbService";

export default function LicensesPage() {
  const [activeTab, setActiveTab] = useState("manage"); // 'create' or 'manage'
  const [licenses, setLicenses] = useState([]);
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lab_licenses");
      if (stored) {
        setLicenses(JSON.parse(stored));
      } else {
        localStorage.setItem("lab_licenses", JSON.stringify(initialLicenses));
        setLicenses(initialLicenses);
      }
    }
  }, []);

  const handleRevoke = (id) => {
    const updated = licenses.map(l => l._id === id ? { ...l, status: l.status === "active" ? "revoked" : "active" } : l);
    setLicenses(updated);
    localStorage.setItem("lab_licenses", JSON.stringify(updated));
  };



  const handleCreateSubmit = (data) => {
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
    const updated = [...licenses, newLic];
    setLicenses(updated);
    localStorage.setItem("lab_licenses", JSON.stringify(updated));
    setActiveTab("manage");
  };

  const getInstituteName = (id) => {
    const match = initialInstitutes.find(c => c._id === id);
    return match ? match.institute_name : "Unknown Institute";
  };

  const columns = [
    {
      header: "License Key Reference",
      accessor: (row) => (
        <div>
          <div className="font-mono text-xs text-slate-800 font-bold max-w-xs truncate">{row.license_key}</div>
          <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">{row.license_code}</div>
        </div>
      )
    },
    {
      header: "Affiliate Institute",
      accessor: (row) => <span className="text-xs text-slate-700 font-semibold">{getInstituteName(row.institute_id)}</span>
    },
   /* {
      header: "Active Sessions & Seats",
      accessor: (row) => (
        <div className="flex items-center gap-2 text-xs">
          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-orange-200">
            <div 
              className="bg-orange-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, (row.active_sessions / row.total_seats) * 100)}%` }}
            />
          </div>
          <span className="font-semibold text-slate-855">{row.active_sessions} / {row.total_seats}</span>
        </div>
      )
    },*/
    {
      header: "Expiry & Days Left",
      accessor: (row) => {
        const remaining = Math.max(0, Math.ceil((new Date(row.expiry_date) - new Date()) / 86400000));
        return (
          <div className="text-xs">
            <div className="font-medium text-slate-855">{row.expiry_date}</div>
            <div className="text-[10px] text-orange-600 font-bold">{remaining} days left</div>
          </div>
        );
      }
    },
    {
      header: "LLM HMAC Metadata",
      accessor: (row) => (
        <div className="text-[10px] text-slate-500 font-medium">
          <div>Model: {row.llm_metadata?.model_used || "Custom"}</div>
          <div className="text-orange-500 font-bold">Latency: {row.llm_metadata?.time_ms || 0}ms</div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
          row.status === "active" ? "bg-orange-50 text-orange-700 border border-orange-300" : "bg-slate-100 text-slate-700 border border-slate-300"
        }`}>
          {row.status}
        </span>
      )
    },
    {
  header: "License Count",
  accessor: (row) => (
    <span className="font-bold text-orange-600">
      {row.license_count || 0}
    </span>
  )
},
    {
  header: "Actions",
  accessor: (row) => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={row.status === "active" ? "danger" : "primary"}
        onClick={() => handleRevoke(row._id)}
      >
        {row.status === "active" ? "Revoke" : "Restore"}
      </Button>
    </div>
  )
}
  ];
return (
  <AdminLayout>
    <div className="space-y-6">

      {/* Tab Header Selector */}
      <div className="flex justify-between items-center border-b border-orange-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            Software Licenses
          </h2>

          <p className="text-xs font-semibold text-slate-500">
            HMAC-signed keys generated dynamically for institutes.
            Controls active student seats and license duration.
          </p>
        </div>

        <div className="flex bg-orange-100/60 p-1 rounded-xl border border-orange-200/80">
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "manage"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Manage Licenses
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "create"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Issue License
          </button>
        </div>
      </div>

      {/* Tab View switching */}
      {activeTab === "create" ? (
        <div className="bg-white p-8 rounded-2xl border border-orange-200/70 shadow-lg max-w-xl mx-auto">
          <LicenseForm
            institutes={initialInstitutes}
            onSubmit={handleCreateSubmit}
            onCancel={() => setActiveTab("manage")}
          />
        </div>
      ) : (
        <ScrollableTable
          columns={columns}
          data={licenses}
        />
      )}

    </div>
  </AdminLayout>
);
}