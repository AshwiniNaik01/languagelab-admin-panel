"use client";

import { useState } from "react";
import InputField from "./InputField";
import Button from "../ui/Button";
import { newLicenseSchema } from "../../schemas/newlicenses.schema";

export default function LicenseForm({ initialData = {}, institutes = [], onSubmit, onCancel }) {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const validatedData = {
      ...data,
      total_seats: data.total_seats ? Number(data.total_seats) : "",
      duration:    data.duration    ? Number(data.duration)    : "",
      time_ms:     data.time_ms     ? Number(data.time_ms)     : "",
    };

    try {
      await newLicenseSchema.validate(validatedData, { abortEarly: false });
      setErrors({});
      onSubmit(validatedData);
    } catch (error) {
      const errorMessages = {};
      if (error.inner) error.inner.forEach((err) => { errorMessages[err.path] = err.message; });
      else errorMessages[error.path] = error.message;
      setErrors(errorMessages);
    }
  };

  const selCls = (field) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-gray-700 outline-none transition-all duration-200 text-sm ${
      errors[field]
        ? "border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl"
    >
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {initialData._id ? "Edit License Key" : "Issue New License Keys"}
      </h3>

      {/* Institute + License Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Assign Institute <span className="ml-1 text-orange-500">*</span>
          </label>
          <select
            name="institute_id"
            defaultValue={initialData.institute_id || ""}
            className={selCls("institute_id")}
          >
            <option value="" disabled>Select Institute</option>
            {institutes.map((c) => (
              <option key={c._id} value={c._id}>{c.institute_name}</option>
            ))}
          </select>
          {errors.institute_id && <p className="mt-1 text-sm text-red-500">{errors.institute_id}</p>}
        </div>

        <InputField
          label="License Code / Reference"
          name="license_code"
          placeholder="e.g. LIC-ABCCE-2026"
          defaultValue={initialData.license_code}
          error={errors.license_code}
          icon="Hash"
        />
      </div>

      {/* Seats + Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Total Seats (concurrent logins)"
          name="total_seats"
          type="number"
          defaultValue={initialData.total_seats || 5}
          error={errors.total_seats}
          icon="Users"
        />
        <InputField
          label="Duration (days)"
          name="duration"
          type="number"
          defaultValue={initialData.duration || 365}
          error={errors.duration}
          icon="Clock"
        />
      </div>

      {/* Start + Expiry dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Start Date"
          name="start_date"
          type="date"
          defaultValue={initialData.start_date ? initialData.start_date.substring(0, 10) : ""}
          error={errors.start_date}
          icon="Calendar"
        />
        <InputField
          label="Expiry Date"
          name="expiry_date"
          type="date"
          defaultValue={initialData.expiry_date ? initialData.expiry_date.substring(0, 10) : ""}
          error={errors.expiry_date}
          icon="Calendar"
        />
      </div>

      {/* LLM Metadata */}
      <div className="border border-orange-200 rounded-2xl p-5 bg-orange-50/40 space-y-4">
        <h4 className="text-sm font-black text-[#3C1E0A]">LLM HMAC Metadata</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Model Used"
            name="model_used"
            placeholder="e.g. Llama 3 70B"
            defaultValue={initialData.llm_metadata?.model_used || "Llama 3 70B"}
            error={errors.model_used}
            icon="Cpu"
          />
          <InputField
            label="Key Pattern Signature"
            name="signature"
            placeholder="HMAC MD5 or SHA256 sig"
            defaultValue={initialData.llm_metadata?.signature || "0x8fa2...23fe"}
            error={errors.signature}
            icon="KeyRound"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Key Generation Time (ms)"
            name="time_ms"
            type="number"
            defaultValue={initialData.llm_metadata?.time_ms || 245}
            error={errors.time_ms}
            icon="Timer"
          />
          <InputField
            label="HMAC License Signature Key"
            name="license_key"
            placeholder="Signed hashed payload"
            defaultValue={initialData.license_key || "LL-HMAC-SHA256-SIGNATURE-KEY"}
            error={errors.license_key}
            icon="ShieldCheck"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">License Status</label>
        <select name="status" defaultValue={initialData.status || "active"} className={selCls("status")}>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
          <option value="suspended">Suspended</option>
        </select>
        {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Generate License</Button>
      </div>
    </form>
  );
}
