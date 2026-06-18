"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import StudentForm from "../components/form/StudentForm";
import { initialStudents, initialColleges, initialLicenses } from "../services/dbService";

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("manage"); // 'create' or 'manage'
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lab_students");
      if (stored) {
        setStudents(JSON.parse(stored));
      } else {
        localStorage.setItem("lab_students", JSON.stringify(initialStudents));
        setStudents(initialStudents);
      }
    }
  }, []);

  const handleToggleStatus = (id) => {
    const updated = students.map(s => {
      if (s._id === id) {
        const nextStatus = s.status === "active" ? "inactive" : "active";
        return { ...s, status: nextStatus, is_active: nextStatus === "active" };
      }
      return s;
    });
    setStudents(updated);
    localStorage.setItem("lab_students", JSON.stringify(updated));
  };

  const handleCreateSubmit = (data) => {
    const newStudent = {
      _id: "stud_" + Date.now(),
      ...data,
      role: "student",
      is_active: true,
      status: "active"
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem("lab_students", JSON.stringify(updated));
    setActiveTab("manage");
  };

  const getCollegeName = (id) => {
    const match = initialColleges.find(c => c._id === id);
    return match ? match.college_name : "Unknown College";
  };

  const getLicenseCode = (id) => {
    const match = initialLicenses.find(l => l._id === id);
    return match ? match.license_code : "None";
  };

  const columns = [
    {
      header: "Student Profile",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          {row.profilePhoto && (
            <img src={row.profilePhoto} alt="Photo" className="w-10 h-10 object-cover rounded-full border border-orange-200" />
          )}
          <div>
            <div className="font-bold text-slate-950">{row.full_name}</div>
            <div className="text-xs text-orange-600 font-bold">{row.roll_no}</div>
          </div>
        </div>
      )
    },
    {
      header: "Email & Enrollment",
      accessor: (row) => (
        <div className="text-xs">
          <div className="text-slate-900 font-semibold">{row.email}</div>
          <div className="text-[10px] text-slate-500 font-mono">Enr: {row.enrollment_no || "N/A"}</div>
        </div>
      )
    },
    {
      header: "Affiliate College",
      accessor: (row) => <span className="text-xs text-slate-700 font-semibold">{getCollegeName(row.college_id)}</span>
    },
    {
      header: "Stream / Year",
      accessor: (row) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-950">{row.course || "General"}</div>
          <div className="text-[10px] text-slate-500">Year {row.year || 1} (Batch {row.batch || "N/A"})</div>
        </div>
      )
    },
    {
      header: "License Seat Key",
      accessor: (row) => <span className="text-xs font-mono font-bold text-slate-500">{getLicenseCode(row.license_id)}</span>
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
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant={row.status === "active" ? "danger" : "primary"} onClick={() => handleToggleStatus(row._id)}>
            {row.status === "active" ? "Disable" : "Enable"}
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
            <h2 className="text-2xl font-black text-slate-950">Language Lab Students</h2>
            <p className="text-xs font-semibold text-slate-500">View enrolled students, update profiles, assign licenses, and manage seat permissions.</p>
          </div>

          <div className="flex bg-orange-100/60 p-1 rounded-xl border border-orange-200/80">
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "manage" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Manage Students
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "create" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Register Student
            </button>
          </div>
        </div>

        {/* Tab View switching */}
        {activeTab === "create" ? (
          <div className="bg-white p-8 rounded-2xl border border-orange-200/70 shadow-lg max-w-xl mx-auto">
            <StudentForm colleges={initialColleges} licenses={initialLicenses} onSubmit={handleCreateSubmit} onCancel={() => setActiveTab("manage")} />
          </div>
        ) : (
          <ScrollableTable columns={columns} data={students} />
        )}

      </div>
    </AdminLayout>
  );
}
