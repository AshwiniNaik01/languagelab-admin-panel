"use client";

import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import CollegeForm from "../components/form/CollegeForm";
import { initialColleges } from "../services/dbService";

export default function CollegesPage() {
  const [colleges, setColleges] = useState(initialColleges);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);

  const handleOpenCreate = () => {
    setEditingCollege(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (college) => {
    setEditingCollege(college);
    setIsFormOpen(true);
  };

  const handleToggleActive = (id) => {
    setColleges(prev => prev.map(c => c._id === id ? { ...c, is_active: !c.is_active } : c));
  };

  const handleSubmit = (data) => {
    if (editingCollege) {
      setColleges(prev => prev.map(c => c._id === editingCollege._id ? { ...c, ...data } : c));
    } else {
      const newCollege = {
        _id: "col_" + Date.now(),
        ...data,
        teachers: [],
        created_by: "superadmin_1"
      };
      setColleges(prev => [...prev, newCollege]);
    }
    setIsFormOpen(false);
  };

  const columns = [
    {
      header: "College Name & Code",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          {row.logo && (
            <img src={row.logo} alt="Logo" className="w-10 h-10 object-cover rounded-xl border border-orange-100" />
          )}
          <div>
            <div className="font-semibold text-gray-800">{row.college_name}</div>
            <div className="text-xs text-orange-500 font-mono font-semibold">{row.college_code}</div>
          </div>
        </div>
      )
    },
    {
      header: "Contact Email & Phone",
      accessor: (row) => (
        <div>
          <div className="text-gray-700">{row.email}</div>
          <div className="text-xs text-gray-400">{row.phone || "No phone"}</div>
        </div>
      )
    },
    {
      header: "Website",
      accessor: (row) => (
        <a href={row.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs">
          {row.website || "No site link"}
        </a>
      )
    },
    {
      header: "Max Students Limit",
      accessor: (row) => <span className="font-semibold">{row.max_students}</span>
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.is_active ? "Active" : "Inactive"}
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Affiliated Colleges</h2>
            <p className="text-sm text-gray-500">Manage all universities and colleges utilizing Language Lab keys.</p>
          </div>
          <Button onClick={handleOpenCreate}>
            Add College Partner
          </Button>
        </div>

        {isFormOpen && (
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
            <CollegeForm
              initialData={editingCollege || {}}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        )}

        <ScrollableTable columns={columns} data={colleges} />
      </div>
    </AdminLayout>
  );
}
