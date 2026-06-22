"use client";

import InputField from "./InputField";
import Button from "../ui/Button";

export default function LicenseForm({ initialData = {}, institutes = [], onSubmit, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.total_seats = Number(data.total_seats);
    data.duration = Number(data.duration);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">
        {initialData._id ? "Edit License Key" : "Issue New Signed License"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Assign Institute</label>
          <select 
            name="institute_id" 
            defaultValue={initialData.institute_id} 
            required
            className="w-full rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="" disabled>Select Institute</option>
            {institutes.map(c => (
              <option key={c._id} value={c._id}>{c.institute_name}</option>
            ))}
          </select>
        </div>

        <InputField
          label="License Code / Reference"
          name="license_code"
          placeholder="e.g. LIC-ABCCE-2026"
          defaultValue={initialData.license_code}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Total Seats / concurrent logins"
          name="total_seats"
          type="number"
          defaultValue={initialData.total_seats || 5}
          required
        />
        <InputField
          label="Duration (in days)"
          name="duration"
          type="number"
          defaultValue={initialData.duration || 365}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Start Date"
          name="start_date"
          type="date"
          defaultValue={initialData.start_date ? initialData.start_date.substring(0, 10) : ""}
          required
        />
        <InputField
          label="Expiry Date"
          name="expiry_date"
          type="date"
          defaultValue={initialData.expiry_date ? initialData.expiry_date.substring(0, 10) : ""}
          required
        />
      </div>

      <div className="border border-[#ffe4d6] rounded-xl p-4 bg-orange-50/50 space-y-2">
        <h4 className="text-sm font-semibold text-orange-800">Open LLM HMAC Metadata Generation</h4>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <InputField
            label="Model Used"
            name="model_used"
            placeholder="e.g. Llama 3 70B"
            defaultValue={initialData.llm_metadata?.model_used || "Llama 3 70B"}
          />
          <InputField
            label="Key Pattern Signature"
            name="signature"
            placeholder="HMAC MD5 or SHA256 sig"
            defaultValue={initialData.llm_metadata?.signature || "0x8fa2...23fe"}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <InputField
            label="Key Generation time (ms)"
            name="time_ms"
            type="number"
            defaultValue={initialData.llm_metadata?.time_ms || 245}
          />
          <InputField
            label="HMAC License Signature Key"
            name="license_key"
            placeholder="Signed hashed payload"
            defaultValue={initialData.license_key || "LL-HMAC-SHA256-SIGNATURE-KEY"}
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">License Status</label>
        <select 
          name="status" 
          defaultValue={initialData.status || "active"} 
          className="w-full rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Generate License
        </Button>
      </div>
    </form>
  );
}
