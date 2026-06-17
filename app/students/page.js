"use client";

import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import StudentForm from "../components/form/StudentForm";
import { initialStudents, initialColleges, initialLicenses } from "../services/dbService";

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (id) => {
    setStudents(prev => prev.map(s => {
      if (s._id === id) {
        const nextStatus = s.status === "active" ? "inactive" : "active";
        return { ...s, status: nextStatus, is_active: nextStatus === "active" };
      }
      return s;
    }));
  };

  const getCollegeName = (id) => {
    const match = initialColleges.find(c => c._id === id);
    return match ? match.college_name : "Unknown College";
  };

  const getLicenseCode = (id) => {
    const match = initialLicenses.find(l => l._id === id);
    return match ? match.license_code : "None";
  };

  const handleSubmit = (data) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s._id === editingStudent._id ? { ...s, ...data } : s));
    } else {
      const newStudent = {
        _id: "stud_" + Date.now(),
        ...data,
        role: "student",
        is_active: true,
        status: "active"
      };
      setStudents(prev => [...prev, newStudent]);
    }
    setIsFormOpen(false);
  };

  const columns = [
    {
      header: "Student Profile",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          {row.profilePhoto && (
            <img src={row.profilePhoto} alt="Photo" className="w-10 h-10 object-cover rounded-full border border-orange-100" />
          )}
          <div>
            <div className="font-semibold text-gray-800">{row.full_name}</div>
            <div className="text-xs text-orange-500 font-semibold">{row.roll_no}</div>
          </div>
        </div>
      )
    },
    {
      header: "Email & Enrollment",
      accessor: (row) => (
        <div>
          <div className="text-xs text-gray-700 font-medium">{row.email}</div>
          <div className="text-[10px] text-gray-400 font-mono">Enr: {row.enrollment_no || "N/A"}</div>
        </div>
      )
    },
    {
      header: "Affiliate College",
      accessor: (row) => <span className="text-xs text-gray-600 font-semibold">{getCollegeName(row.college_id)}</span>
    },
    {
      header: "Stream / Year",
      accessor: (row) => (
        <div className="text-xs text-gray-700">
          <div>{row.course || "General"}</div>
          <div className="text-[10px] text-orange-400">Year {row.year || 1} (Batch {row.batch || "N/A"})</div>
        </div>
      )
    },
    {
      header: "License Seat Key",
      accessor: (row) => <span className="text-xs font-mono font-bold text-gray-500">{getLicenseCode(row.license_id)}</span>
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
            Profile
          </Button>
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Language Lab Students</h2>
            <p className="text-sm text-gray-500">View enrolled students, update profiles, assign licenses, and manage seat permissions.</p>
          </div>
          <Button onClick={handleOpenCreate}>
            Register Student
          </Button>
        </div>

        {isFormOpen && (
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
            <StudentForm
              initialData={editingStudent || {}}
              colleges={initialColleges}
              licenses={initialLicenses}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        )}

        <ScrollableTable columns={columns} data={students} />
      </div>
    </AdminLayout>
  );
}
