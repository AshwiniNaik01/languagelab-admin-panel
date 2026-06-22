"use client";

import InputField from "./InputField";
import Button from "../ui/Button";

export default function StudentForm({ initialData = {}, institutes = [], licenses = [], onSubmit, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.year = Number(data.year);
    data.is_active = data.is_active === "on" || data.is_active === true;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">
        {initialData._id ? "Edit Student Profile" : "Register New Student"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          name="full_name"
          placeholder="e.g. Alice Cooper"
          defaultValue={initialData.full_name}
          required
        />
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. student@institute.edu"
          defaultValue={initialData.email}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder={initialData._id ? "••••••••" : "Enter password"}
          required={!initialData._id}
        />
        <InputField
          label="Phone Number"
          name="phone"
          placeholder="e.g. +1 555-0901"
          defaultValue={initialData.phone}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Institute Affiliate <span className="ml-1 text-orange-500">*</span>
          </label>
          <select
            name="institute_id"
            defaultValue={initialData.institute_id}
            required
            className="w-full rounded-xl border border-orange-300 bg-white text-black px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="" disabled>Select Institute</option>
            {institutes.map(c => (
              <option key={c._id} value={c._id}>{c.institute_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Assigned License Key</label>
          <select
            name="license_id"
            defaultValue={initialData.license_id}
            className="w-full rounded-xl border border-orange-300 bg-white text-black px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="">No License</option>
            {licenses.map(l => (
              <option key={l._id} value={l._id}>{l.license_code}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InputField
          label="Roll Number"
          name="roll_no"
          placeholder="CS-2026-001"
          defaultValue={initialData.roll_no}
          required
        />
        <InputField
          label="Enrollment No (sparse)"
          name="enrollment_no"
          placeholder="ENR-998877"
          defaultValue={initialData.enrollment_no}
        />
        <InputField
          label="Batch Year"
          name="batch"
          placeholder="2026"
          defaultValue={initialData.batch}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InputField
          label="Course / Stream"
          name="course"
          placeholder="Computer Science"
          defaultValue={initialData.course}
        />
        <InputField
          label="Current Year"
          name="year"
          type="number"
          defaultValue={initialData.year || 1}
        />
        <InputField
          label="Profile Photo URL"
          name="profilePhoto"
          placeholder="S3 Photo URL"
          defaultValue={initialData.profilePhoto}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Student Excel Bulk Upload File Path"
          name="student_excel"
          placeholder="/uploads/excel.xlsx"
          defaultValue={initialData.student_excel}
        />
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Status</label>
          <select
            name="status"
            defaultValue={initialData.status || "active"}
            className="w-full rounded-xl border border-orange-300 bg-white text-black px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          name="is_active"
          id="student_is_active"
          defaultChecked={initialData.is_active !== false}
          className="accent-orange-500 w-4 h-4 rounded"
        />
        <label htmlFor="student_is_active" className="text-sm font-semibold text-gray-700">
          Mark Student as Active
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Student Profile
        </Button>
      </div>
    </form>
  );
}
