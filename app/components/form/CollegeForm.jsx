"use client";

import { useState } from "react";
import InputField from "./InputField";
import Button from "../ui/Button";
import LogoFileUploader from "./LogoFileUploader";

export default function CollegeForm({ initialData = {}, onSubmit, onCancel }) {
  const [logoBase64, setLogoBase64] = useState(initialData.logo || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.is_active = data.is_active === "on" || data.is_active === true;
    data.logo = logoBase64; // Set compressed logo
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {initialData._id ? "Edit College Information" : "Create New College Partner"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="College Name"
          name="college_name"
          placeholder="e.g. VP College"
          defaultValue={initialData.college_name}
          required
        />
        <InputField
          label="College Code"
          name="college_code"
          placeholder="e.g. VP2486"
          defaultValue={initialData.college_code}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. mokateashwini4@gmail.com"
          defaultValue={initialData.email}
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder={initialData._id ? "••••••••" : "Enter account password"}
          defaultValue={initialData.password}
          required={!initialData._id}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Phone Number"
          name="phone"
          placeholder="e.g. +91 9876543210"
          defaultValue={initialData.phone}
        />
        <InputField
          label="Website URL"
          name="website"
          placeholder="e.g. http://vo.in"
          defaultValue={initialData.website}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <InputField
          label="Address"
          name="address"
          placeholder="e.g. Vaijapur"
          defaultValue={initialData.address}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <LogoFileUploader 
          onFileUploaded={setLogoBase64} 
          initialLogoUrl={initialData.logo} 
        />
        
        <InputField
          label="Max Students Cap"
          name="max_students"
          type="number"
          placeholder="e.g. 100"
          defaultValue={initialData.max_students || 100}
          required
        />
      </div>

      <div className="flex items-center gap-3.5 py-3 border-t border-orange-500/10">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={initialData.is_active !== false}
          className="accent-orange-500 w-4.5 h-4.5 rounded cursor-pointer"
        />
        <label htmlFor="is_active" className="text-sm font-bold text-[#3C1E0A] select-none cursor-pointer">
          Authorize and activate this college license immediately
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" onClick={onCancel} className="px-6 py-2.5">
          Cancel
        </Button>
        <Button type="submit" className="px-8 py-2.5">
          {initialData._id ? "Update College" : "Register College"}
        </Button>
      </div>
    </form>
  );
}
