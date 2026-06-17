"use client";

import InputField from "./InputField";
import Button from "../ui/Button";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useState } from "react";

export default function TeacherForm({ initialData = {}, colleges = [], onSubmit, onCancel }) {
  const [selectedColleges, setSelectedColleges] = useState(initialData.assigned_colleges || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.assigned_colleges = selectedColleges;
    data.is_active = data.is_active === "on" || data.is_active === true;
    onSubmit(data);
  };

  const collegeOptions = colleges.map(c => c.college_name);
  const collegeIdsMap = colleges.reduce((acc, curr) => {
    acc[curr.college_name] = curr._id;
    acc[curr._id] = curr.college_name;
    return acc;
  }, {});

  const currentSelectedNames = selectedColleges.map(id => collegeIdsMap[id] || id);

  const handleCollegeChange = (names) => {
    const ids = names.map(name => collegeIdsMap[name] || name);
    setSelectedColleges(ids);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">
        {initialData._id ? "Edit Teacher Details" : "Create New Teacher Staff"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          name="full_name"
          placeholder="e.g. Dr. Sarah Jenkins"
          defaultValue={initialData.full_name}
          required
        />
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. teacher@college.edu"
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
          placeholder="e.g. +1 555-0144"
          defaultValue={initialData.phone}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Profile Photo URL"
          name="profilePhoto"
          placeholder="S3 photo path"
          defaultValue={initialData.profilePhoto}
        />
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Status</label>
          <select 
            name="status" 
            defaultValue={initialData.status || "active"} 
            className="w-full rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="z-30 relative">
        <MultiSelectDropdown
          label="Assign Colleges"
          options={collegeOptions}
          value={currentSelectedNames}
          onChange={handleCollegeChange}
        />
      </div>

      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          name="is_active"
          id="teacher_is_active"
          defaultChecked={initialData.is_active !== false}
          className="accent-orange-500 w-4 h-4 rounded"
        />
        <label htmlFor="teacher_is_active" className="text-sm font-semibold text-gray-700">
          Mark Teacher as Active
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Teacher
        </Button>
      </div>
    </form>
  );
}
