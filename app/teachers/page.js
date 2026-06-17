"use client";

import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import TeacherForm from "../components/form/TeacherForm";
import { initialTeachers, initialColleges } from "../services/dbService";


export default function TeachersPage() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const handleOpenCreate = () => {
    setEditingTeacher(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (teacher) => {
    setEditingTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (id) => {
    setTeachers(prev => prev.map(t => {
      if (t._id === id) {
        const nextStatus = t.status === "active" ? "suspended" : "active";
        return { ...t, status: nextStatus, is_active: nextStatus === "active" };
      }
      return t;
    }));
  };

  const handleSubmit = (data) => {
    if (editingTeacher) {
      setTeachers(prev => prev.map(t => t._id === editingTeacher._id ? { ...t, ...data } : t));
    } else {
      const newTeacher = {
        _id: "teach_" + Date.now(),
        ...data,
        role: "teacher",
        created_by: "superadmin_1"
      };
      setTeachers(prev => [...prev, newTeacher]);
    }
    setIsFormOpen(false);
  };

  const getCollegesNames = (assignedIds = []) => {
    return assignedIds.map(id => {
      const match = initialColleges.find(c => c._id === id);
      return match ? match.college_name : id;
    }).join(", ") || "None assigned";
  };

  const columns = [
    {
      header: "Teacher Name",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          {row.profilePhoto && (
            <img src={row.profilePhoto} alt="Photo" className="w-10 h-10 object-cover rounded-full border border-orange-100" />
          )}
          <div>
            <div className="font-semibold text-gray-800">{row.full_name}</div>
            <div className="text-xs text-orange-500 font-semibold uppercase">{row.role}</div>
          </div>
        </div>
      )
    },
    {
      header: "Email & Contact",
      accessor: (row) => (
        <div>
          <div className="text-gray-700 text-xs">{row.email}</div>
          <div className="text-[11px] text-gray-400">{row.phone || "No phone"}</div>
        </div>
      )
    },
    {
      header: "Assigned Colleges",
      accessor: (row) => (
        <span className="text-xs font-medium text-gray-600 block max-w-xs truncate">
          {getCollegesNames(row.assigned_colleges)}
        </span>
      )
    },
    {
      header: "Status Mode",
      accessor: (row) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          row.status === "active" 
            ? "bg-green-100 text-green-700" 
            : row.status === "suspended" 
            ? "bg-red-100 text-red-700" 
            : "bg-gray-100 text-gray-600"
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
            Edit
          </Button>
          <Button size="sm" variant={row.status === "active" ? "danger" : "primary"} onClick={() => handleToggleStatus(row._id)}>
            {row.status === "active" ? "Suspend" : "Activate"}
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
            <h2 className="text-2xl font-bold text-gray-800">Language Instructors & Staff</h2>
            <p className="text-sm text-gray-500">Register teachers assigned to specific colleges to curate and moderate curriculum content.</p>
          </div>
          <Button onClick={handleOpenCreate}>
            Register Instructor
          </Button>
        </div>

        {isFormOpen && (
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
            <TeacherForm
              initialData={editingTeacher || {}}
              colleges={initialColleges}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        )}

        <ScrollableTable columns={columns} data={teachers} />
      </div>
    </AdminLayout>
  );
}
