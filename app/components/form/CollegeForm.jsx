"use client";

import InputField from "./InputField";
import Button from "../ui/Button";

export default function CollegeForm({ initialData = {}, onSubmit, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.is_active = data.is_active === "on" || data.is_active === true;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">
        {initialData._id ? "Edit College Details" : "Create New College"}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="College Name"
          name="college_name"
          placeholder="e.g. MMCOE, Pune"
          defaultValue={initialData.college_name}
          required
        />
        <InputField
          label="College Code"
          name="college_code"
          placeholder="e.g. MMCOE"
          defaultValue={initialData.college_code}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. admin@college.edu"
          defaultValue={initialData.email}
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder={initialData._id ? "••••••••" : "Enter password"}
          required={!initialData._id}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Phone Number"
          name="phone"
          placeholder="e.g. +1 555-0199"
          defaultValue={initialData.phone}
        />
        <InputField
          label="Website URL"
          name="website"
          placeholder="e.g. https://college.edu"
          defaultValue={initialData.website}
        />
      </div>

      <InputField
        label="Address"
        name="address"
        placeholder="Enter full physical address"
        defaultValue={initialData.address}
      />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Logo Image URL"
          name="logo"
          placeholder="S3 or public URL"
          defaultValue={initialData.logo}
        />
        <InputField
          label="Max Students Cap"
          name="max_students"
          type="number"
          defaultValue={initialData.max_students || 500}
        />
      </div>

      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={initialData.is_active !== false}
          className="accent-orange-500 w-4 h-4 rounded"
        />
        <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
          Mark College as Active
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save College
        </Button>
      </div>
    </form>
  );
}
