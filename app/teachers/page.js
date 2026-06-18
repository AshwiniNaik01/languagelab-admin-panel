"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import TeacherForm from "../components/form/TeacherForm";
import ToggleSwitch from "../components/form/ToggleSwitch";
import {
  getTeachers,
  updateTeacher,
} from "../services/teacher";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = Cookies.get("token");

      const response = await getTeachers({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Teachers Response:", response.data);

      setTeachers(response.data.data || []);
    } catch (error) {
      console.error("Fetch Teachers Error:", error);
    }
  };

  const handleSubmit = async (data) => {
    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t._id === editingTeacher._id ? { ...t, ...data } : t
        )
      );
    } else {
      setTeachers((prev) => [
        ...prev,
        {
          _id: "teach_" + Date.now(),
          ...data,
        },
      ]);
    }

    await fetchTeachers();

    setIsFormOpen(false);
    setEditingTeacher(null);
  };

  const handleStatusToggle = async (teacher, newValue) => {
    try {
      const token = Cookies.get("token");

      console.log("Teacher ID:", teacher._id);
      console.log("New Value:", newValue);

      await updateTeacher(
        teacher._id,
        {
          is_active: newValue,
          status: newValue ? "active" : "inactive",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeachers((prev) =>
        prev.map((t) =>
          t._id === teacher._id
            ? {
                ...t,
                is_active: newValue,
                status: newValue ? "active" : "inactive",
              }
            : t
        )
      );

      await fetchTeachers();
    } catch (error) {
      console.error(
        "Toggle Update Error:",
        error.response?.data || error
      );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Teachers</h2>

          <Button onClick={() => setIsFormOpen(true)}>
            Add Teacher
          </Button>
        </div>

        {isFormOpen && (
          <TeacherForm
            initialData={editingTeacher || {}}
            onCancel={() => setIsFormOpen(false)}
            onSuccess={handleSubmit}
          />
        )}

        <ScrollableTable
          data={teachers}
          columns={[
            {
              header: "Full Name",
              accessor: "full_name",
            },
            {
              header: "Email",
              accessor: "email",
            },
            {
              header: "Phone",
              accessor: "phone",
            },
            {
              header: "Role",
              accessor: "role",
            },
            {
              header: "Status",
              accessor: (row) => (
                <ToggleSwitch
                  checked={row.is_active}
                  onChange={(newValue) =>
                    handleStatusToggle(row, newValue)
                  }
                />
              ),
            },
            {
              header: "Created By",
              accessor: (row) =>
                row.created_by?.full_name || "-",
            },
            {
              header: "Created At",
              accessor: (row) =>
                new Date(row.createdAt).toLocaleDateString(),
            },
          ]}
        />
      </div>
    </AdminLayout>
  );
}