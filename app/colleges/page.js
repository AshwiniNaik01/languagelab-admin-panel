"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import CollegeForm from "../components/form/CollegeForm";
import { initialColleges } from "../services/dbService";

export default function CollegesPage() {
  const [activeTab, setActiveTab] = useState("manage"); // 'create' or 'manage'
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lab_colleges");
      if (stored) {
        setColleges(JSON.parse(stored));
      } else {
        localStorage.setItem("lab_colleges", JSON.stringify(initialColleges));
        setColleges(initialColleges);
      }
    }
  }, []);

  const handleToggleActive = (id) => {
    const updated = colleges.map(c => c._id === id ? { ...c, is_active: !c.is_active } : c);
    setColleges(updated);
    localStorage.setItem("lab_colleges", JSON.stringify(updated));
  };

  const handleCreateSubmit = (data) => {
    const newCollege = {
      _id: "col_" + Date.now(),
      ...data,
      teachers: [],
      created_by: "superadmin_1"
    };
    const updated = [...colleges, newCollege];
    setColleges(updated);
    localStorage.setItem("lab_colleges", JSON.stringify(updated));
    setActiveTab("manage");
  };

  const columns = [
    {
      header: "College Name & Code",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          {row.logo && (
            <img src={row.logo} alt="Logo" className="w-10 h-10 object-cover rounded-xl border border-orange-200" />
          )}
          <div>
            <div className="font-bold text-slate-950">{row.college_name}</div>
            <div className="text-xs text-orange-600 font-mono font-extrabold">{row.college_code}</div>
          </div>
        </div>
      )
    },
    {
      header: "Contact Email & Phone",
      accessor: (row) => (
        <div className="text-xs">
          <div className="text-slate-900 font-semibold">{row.email}</div>
          <div className="text-slate-500 font-medium">{row.phone || "No phone"}</div>
        </div>
      )
    },
    {
      header: "Website",
      accessor: (row) => (
        <a href={row.website} target="_blank" rel="noreferrer" className="text-orange-600 font-bold hover:underline text-xs">
          {row.website || "No site link"}
        </a>
      )
    },
    {
      header: "Max Students Limit",
      accessor: (row) => <span className="font-extrabold text-slate-950">{row.max_students}</span>
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
          row.is_active ? "bg-orange-50 text-orange-700 border border-orange-300" : "bg-slate-100 text-slate-700 border border-slate-300"
        }`}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant={row.is_active ? "danger" : "primary"} onClick={() => handleToggleActive(row._id)}>
            {row.is_active ? "Deactivate" : "Activate"}
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
            <h2 className="text-2xl font-black text-slate-950">Affiliated Colleges</h2>
            <p className="text-xs font-semibold text-slate-500">Manage all universities and colleges utilizing Language Lab keys.</p>
          </div>

          <div className="flex bg-orange-100/60 p-1 rounded-xl border border-orange-200/80">
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "manage" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Manage Partner Lists
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "create" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Create New Entry
            </button>
          </div>
        </div>

        {/* Tab View switching */}
        {activeTab === "create" ? (
          <div className="bg-white p-8 rounded-2xl border border-orange-200/70 shadow-lg max-w-xl mx-auto">
            <CollegeForm onSubmit={handleCreateSubmit} onCancel={() => setActiveTab("manage")} />
          </div>
        ) : (
          <ScrollableTable columns={columns} data={colleges} />
        )}

      </div>
    </AdminLayout>
  );
}
