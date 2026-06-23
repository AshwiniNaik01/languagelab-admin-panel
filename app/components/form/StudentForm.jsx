"use client";

import InputField from "./InputField";
import Button from "../ui/Button";
import { useState } from "react";
import Swal from "sweetalert2";
import { studentSchema } from "../../schemas/student.schema.js";

export default function StudentForm({ initialData = {}, institutes = [], licenses = [], onSubmit, onCancel }) {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const validatedData = {
      ...data,
      year: data.year ? Number(data.year) : "",
      is_active: data.is_active === "on" || data.is_active === true,
    };

    // If student_excel is an empty File object, delete it
    if (validatedData.student_excel && validatedData.student_excel instanceof File && validatedData.student_excel.size === 0) {
      delete validatedData.student_excel;
    }

    try {
      await studentSchema.validate(validatedData, {
        abortEarly: false,
        context: { isEdit: !!initialData._id },
      });
      setErrors({});
      onSubmit(validatedData);
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      } else {
        validationErrors[err.path] = err.message;
      }
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
      <div className="flex justify-between items-center border-b border-orange-50 pb-2 mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {initialData._id ? "Edit Student Profile" : "Register New Student"}
        </h3>
        
        {/* Bulk upload button on the top right */}
        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#3C1E0A] bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all duration-200 shadow-sm">
          <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Excel Bulk Upload</span>
          <input
            type="file"
            name="student_excel"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                Swal.fire({
                  icon: "success",
                  title: "Excel File Selected",
                  text: `${file.name} is ready.`,
                  timer: 2000,
                  showConfirmButton: false
                });
              }
            }}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          name="full_name"
          placeholder="e.g. Alice Cooper"
          defaultValue={initialData.full_name}
          error={errors.full_name}
        />
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. student@institute.edu"
          defaultValue={initialData.email}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder={initialData._id ? "••••••••" : "Enter password"}
          error={errors.password}
        />
        <InputField
          label="Phone Number"
          name="phone"
          placeholder="e.g. +1 555-0901"
          defaultValue={initialData.phone}
          error={errors.phone}
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
            className={`w-full rounded-xl border bg-white text-black px-4 py-3 text-sm focus:outline-none ${errors.institute_id
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              }`}
          >
            <option value="" disabled selected={!initialData.institute_id}>Select Institute</option>
            {institutes.map(c => (
              <option key={c._id} value={c._id}>{c.institute_name}</option>
            ))}
          </select>
          {errors.institute_id && (
            <p className="mt-1 text-sm text-red-500">{errors.institute_id}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Assigned License Key</label>
          <select
            name="license_id"
            defaultValue={initialData.license_id}
            className={`w-full rounded-xl border bg-white text-black px-4 py-3 text-sm focus:outline-none ${errors.license_id
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-orange-300 focus:border-orange-500"
              }`}
          >
            <option value="">No License</option>
            {licenses.map(l => (
              <option key={l._id} value={l._id}>{l.license_code}</option>
            ))}
          </select>
          {errors.license_id && (
            <p className="mt-1 text-sm text-red-500">{errors.license_id}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InputField
          label="Roll Number"
          name="roll_no"
          placeholder="CS-2026-001"
          defaultValue={initialData.roll_no}
          error={errors.roll_no}
        />
        <InputField
          label="Enrollment No"
          name="enrollment_no"
          placeholder="ENR-998877"
          defaultValue={initialData.enrollment_no}
          error={errors.enrollment_no}
        />
        <InputField
          label="Batch Year"
          name="batch"
          placeholder="2026"
          defaultValue={initialData.batch}
          error={errors.batch}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InputField
          label="Course / Stream"
          name="course"
          placeholder="Computer Science"
          defaultValue={initialData.course}
          error={errors.course}
        />
        <InputField
          label="Current Year"
          name="year"
          type="number"
          defaultValue={initialData.year || 1}
          error={errors.year}
        />
        <InputField
          label="Profile Photo URL"
          name="profilePhoto"
          placeholder="S3 Photo URL"
          defaultValue={initialData.profilePhoto}
          error={errors.profilePhoto}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Status</label>
          <select
            name="status"
            defaultValue={initialData.status || "active"}
            className={`w-full rounded-xl border bg-white text-black px-4 py-3 text-sm focus:outline-none ${errors.status
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-orange-300 focus:border-orange-500"
              }`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status}</p>
          )}
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
