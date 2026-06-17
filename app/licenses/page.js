"use client";

import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import LicenseForm from "../components/form/LicenseForm";
import { initialLicenses, initialColleges } from "../services/dbService";

export default function LicensesPage() {
  const [licenses, setLicenses] = useState(initialLicenses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);

  const handleOpenCreate = () => {
    setEditingLicense(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (lic) => {
    setEditingLicense(lic);
    setIsFormOpen(true);
  };

  const handleRevoke = (id) => {
    setLicenses(prev => prev.map(l => l._id === id ? { ...l, status: l.status === "active" ? "revoked" : "active" } : l));
  };

  const getCollegeName = (id) => {
    const match = initialColleges.find(c => c._id === id);
    return match ? match.college_name : "Unknown College";
  };

  const handleSubmit = (data) => {
    if (editingLicense) {
      setLicenses(prev => prev.map(l => l._id === editingLicense._id ? { ...l, ...data, llm_metadata: { ...l.llm_metadata, ...data } } : l));
    } else {
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
      setLicenses(prev => [...prev, newLic]);
    }
    setIsFormOpen(false);
  };

  const columns = [
    {
      header: "License Key Info",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-800 text-sm font-mono truncate max-w-xs">{row.license_key}</div>
          <div className="text-xs text-orange-500 font-semibold">{row.license_code}</div>
        </div>
      )
    },
    {
      header: "Affiliate College",
      accessor: (row) => <span className="text-gray-700 text-xs font-semibold">{getCollegeName(row.college_id)}</span>
    },
    {
      header: "Seat Allocation (Active / Total)",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-12 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full" 
              style={{ width: `${Math.min(100, (row.active_sessions / row.total_seats) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold">{row.active_sessions} / {row.total_seats}</span>
        </div>
      )
    },
    {
      header: "Expiry Date & Remaining",
      accessor: (row) => {
        const remaining = Math.max(0, Math.ceil((new Date(row.expiry_date) - new Date()) / 86400000));
        return (
          <div>
            <div className="text-xs font-medium">{row.expiry_date}</div>
            <div className="text-[10px] text-orange-500 font-bold">{remaining} days remaining</div>
          </div>
        );
      }
    },
    {
      header: "LLM Sig Speed",
      accessor: (row) => (
        <div className="text-[11px] text-gray-500">
          <div>Model: {row.llm_metadata?.model_used || "Custom"}</div>
          <div className="font-mono text-orange-400">Lat: {row.llm_metadata?.time_ms || 0}ms</div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          row.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(row)}>
            Config
          </Button>
          <Button size="sm" variant={row.status === "active" ? "danger" : "primary"} onClick={() => handleRevoke(row._id)}>
            {row.status === "active" ? "Revoke" : "Restore"}
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Software Licenses</h2>
            <p className="text-sm text-gray-500">HMAC-signed keys generated dynamically for colleges. Controls active student seats and license duration.</p>
          </div>
          <Button onClick={handleOpenCreate}>
            Issue New License
          </Button>
        </div>

        {isFormOpen && (
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
            <LicenseForm
              initialData={editingLicense || {}}
              colleges={initialColleges}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        )}

        <ScrollableTable columns={columns} data={licenses} />
      </div>
    </AdminLayout>
  );
}
