"use client";

import { useRef, useState } from "react";
import InputField from "./InputField";
import Button from "../ui/Button";
import { studentSchema } from "../../schemas/student.schema.js";

export default function StudentForm({ initialData = {}, institutes = [], onSubmit, onCancel }) {
  const [errors, setErrors] = useState({});
  const photoRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.year) data.year = Number(data.year);
    else delete data.year;

    try {
      await studentSchema.validate(data, { abortEarly: false });
      setErrors({});
      if (photoRef.current?.files?.[0]) data.studentPhoto = photoRef.current.files[0];
      onSubmit(data);
    } catch (err) {
      const validationErrors = {};
      if (err.inner) err.inner.forEach((e) => { validationErrors[e.path] = e.message; });
      else validationErrors[err.path] = err.message;
      setErrors(validationErrors);
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
        {initialData._id ? "Edit Student Profile" : "Register New Student"}
      </h3>

      {/* Full Name + Roll No */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          name="full_name"
          placeholder="e.g. Priya Sharma"
          defaultValue={initialData.full_name}
          error={errors.full_name}
          icon="User"
        />
        <InputField
          label="Roll Number"
          name="roll_no"
          placeholder="e.g. CS-2026-001"
          defaultValue={initialData.roll_no}
          error={errors.roll_no}
          icon="Hash"
        />
      </div>

      {/* Enrollment No + Institute */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Enrollment No"
          name="enrollment_no"
          placeholder="e.g. EN2024001"
          defaultValue={initialData.enrollment_no}
          error={errors.enrollment_no}
          icon="FileText"
        />
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Institute <span className="ml-1 text-orange-500">*</span>
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
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Email (optional)"
          name="email"
          type="email"
          placeholder="student@example.com"
          defaultValue={initialData.email}
          error={errors.email}
          icon="Mail"
        />
        <InputField
          label="Phone (optional)"
          name="phone"
          placeholder="10-digit number"
          defaultValue={initialData.phone}
          error={errors.phone}
          icon="Phone"
        />
      </div>

      {/* Batch + Stream + Year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Batch (optional)"
          name="batch"
          placeholder="e.g. 2024-2026"
          defaultValue={initialData.batch}
          error={errors.batch}
          icon="Calendar"
        />
        <InputField
          label="Stream (optional)"
          name="course"
          placeholder="e.g. Computer Science"
          defaultValue={initialData.course}
          error={errors.course}
          icon="BookOpen"
        />
        <InputField
          label="Year (optional)"
          name="year"
          type="number"
          placeholder="e.g. 1"
          defaultValue={initialData.year}
          error={errors.year}
          icon="Hash"
        />
      </div>

      {/* Photo */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Photo (optional)</label>
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          className="w-full border border-orange-300 hover:border-orange-400 rounded-xl px-4 py-3 text-sm text-slate-500
            file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0
            file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all"
        />
      </div>

      {/* Password note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 font-semibold">
        Password is auto-generated by the backend as:{" "}
        <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">
          institute_code + enrollment_no
        </code>
        . It will be shown once in the response — save it immediately.
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">
          {initialData._id ? "Update Student" : "Register Student"}
        </Button>
      </div>
    </form>
  );
}
