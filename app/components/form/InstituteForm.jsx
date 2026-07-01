"use client";

import { useEffect, useRef, useState } from "react";
import InputField from "./InputField";
import Button from "../ui/Button";
import LogoFileUploader from "./LogoFileUploader";
import {
  instituteSchema,
  editInstituteSchema,
} from "../../schemas/institute.schema.js";
import { ChevronDown, Check, X } from "lucide-react";

function CourseMultiSelect({ courses, selectedIds, onToggle, onClear, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block mb-2 text-sm font-semibold text-[#3C1E0A]">
        Assign Courses <span className="text-orange-500 ml-1">*</span>
        <span className="ml-2 text-xs font-normal text-slate-500">
          (select one or more)
        </span>
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all bg-white cursor-pointer ${
          error
            ? "border-red-400"
            : open
              ? "border-orange-500 ring-2 ring-orange-100"
              : "border-slate-200 hover:border-orange-300"
        }`}
      >
        <span
          className={
            selectedIds.length === 0
              ? "text-slate-400"
              : "text-slate-800 font-semibold"
          }
        >
          {selectedIds.length === 0
            ? "Select courses…"
            : `${selectedIds.length} course${selectedIds.length !== 1 ? "s" : ""} selected`}
        </span>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Selected tags */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {courses
            .filter((c) => selectedIds.includes(c._id))
            .map((c) => (
              <span
                key={c._id}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg"
              >
                {c.course_name}
                <X
                  size={10}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => onToggle(c._id)}
                />
              </span>
            ))}
        </div>
      )}

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {courses.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400 italic">
              No courses available.
            </p>
          ) : (
            courses.map((c) => {
              const checked = selectedIds.includes(c._id);
              return (
                <div
                  key={c._id}
                  onClick={() => onToggle(c._id)}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                    checked ? "bg-orange-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      checked
                        ? "bg-orange-500 border-orange-500"
                        : "border-slate-300"
                    }`}
                  >
                    {checked && (
                      <Check size={10} strokeWidth={3} className="text-white" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {c.course_name}
                    </p>
                    <p className="text-[10px] text-orange-600 font-mono font-bold">
                      {c.course_code}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Normalise course_id from the backend (can be a string, an array of strings, or an array of objects)
const normaliseCourseIds = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw))
    return raw.map((c) => (typeof c === "object" ? c._id : c)).filter(Boolean);
  return [raw];
};

export default function InstituteForm({
  initialData = {},
  courses = [],
  onSubmit,
  onCancel,
}) {
  const [logoBase64, setLogoBase64] = useState(initialData.logo || "");
  const [errors, setErrors] = useState({});

  const initAddress = (raw) => {
    if (!raw) return {};
    if (typeof raw === "object") return raw;
    return {};
  };
  const [addressData, setAddressData] = useState(initAddress(initialData.address));
  const setAddr = (field, val) => setAddressData((prev) => ({ ...prev, [field]: val }));

  // Multi-select state for courses
  // (the API returns assigned courses as `courses` — full objects — on fetch,
  // but `course_id` — plain IDs — on the create/edit payload; accept either)
  const [selectedCourseIds, setSelectedCourseIds] = useState(
    normaliseCourseIds(initialData.course_id ?? initialData.courses),
  );

  const toggleCourse = (id) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.is_active = data.is_active === "on" || data.is_active === true;
    data.logo = logoBase64;
    data.course_id = selectedCourseIds;
    data.address = addressData;

    // Validate — course_id treated as array for validation
    const schema = initialData._id ? editInstituteSchema : instituteSchema;
    try {
      await schema.validate(
        {
          ...data,
          course_id: selectedCourseIds.length > 0 ? selectedCourseIds[0] : "",
        },
        { abortEarly: false },
      );
      setErrors({});
    } catch (error) {
      const validationErrors = {};
      error.inner?.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      return;
    }

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl"
    >
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {initialData._id
          ? "Edit Institute Information"
          : "Create New Institute Partner"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Institute Name"
          name="institute_name"
          placeholder="e.g. VP Institute"
          defaultValue={initialData.institute_name}
          error={errors.institute_name}
          icon="Building2"
        />
        <InputField
          label="Institute Code"
          name="institute_code"
          placeholder="e.g. VP2486"
          defaultValue={initialData.institute_code}
          error={errors.institute_code}
          icon="Hash"
        />
      </div>

      {/* Multi-select courses dropdown */}
      <CourseMultiSelect
        courses={courses}
        selectedIds={selectedCourseIds}
        onToggle={toggleCourse}
        onClear={() => setSelectedCourseIds([])}
        error={errors.course_id}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. contact@institute.edu"
          defaultValue={initialData.email}
          error={errors.email}
          icon="Mail"
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder={
            initialData._id
              ? "Leave blank to keep current"
              : "Enter account password"
          }
          error={errors.password}
          icon="Lock"
          showToggle
          autoComplete="new-password"
          disabled={!!initialData._id}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Phone Number"
          name="phone"
          placeholder="e.g. 9876543210"
          defaultValue={initialData.phone}
          error={errors.phone}
          icon="Phone"
        />
        <InputField
          label="Website URL"
          name="website"
          placeholder="e.g. https://institute.edu"
          defaultValue={initialData.website}
          error={errors.website}
          icon="Globe"
        />
      </div>

      {/* Address */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#3C1E0A]">Address</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Line 1"
            name="_addr_line1"
            placeholder="Street / Building"
            value={addressData.line1 || ""}
            onChange={(e) => setAddr("line1", e.target.value)}
            icon="MapPin"
          />
          <InputField
            label="Line 2"
            name="_addr_line2"
            placeholder="Area / Locality (optional)"
            value={addressData.line2 || ""}
            onChange={(e) => setAddr("line2", e.target.value)}
            icon="MapPin"
          />
          <InputField
            label="Pincode"
            name="_addr_pincode"
            placeholder="e.g. 411001"
            value={addressData.pincode || ""}
            onChange={(e) => setAddr("pincode", e.target.value)}
            icon="Hash"
          />
          <InputField
            label="State"
            name="_addr_state"
            placeholder="e.g. Maharashtra"
            value={addressData.state || ""}
            onChange={(e) => setAddr("state", e.target.value)}
            icon="MapPin"
          />
          <InputField
            label="District"
            name="_addr_dist"
            placeholder="e.g. Pune"
            value={addressData.dist || ""}
            onChange={(e) => setAddr("dist", e.target.value)}
            icon="MapPin"
          />
          <InputField
            label="Taluka"
            name="_addr_taluka"
            placeholder="e.g. Haveli"
            value={addressData.taluka || ""}
            onChange={(e) => setAddr("taluka", e.target.value)}
            icon="MapPin"
          />
          <InputField
            label="Authorized Person Name"
            name="_addr_autorizedName"
            placeholder="Contact person name"
            value={addressData.autorizedName || ""}
            onChange={(e) => setAddr("autorizedName", e.target.value)}
            icon="User"
          />
          <InputField
            label="Authorized Person Phone"
            name="_addr_autorizedPhono"
            placeholder="e.g. 9876543210"
            value={addressData.autorizedPhono || ""}
            onChange={(e) => setAddr("autorizedPhono", e.target.value)}
            icon="Phone"
          />
        </div>
        <InputField
          label="Nearby Landmarks"
          name="_addr_nearbyLandmarks"
          placeholder="e.g. Near Railway Station"
          value={addressData.nearbyLandmarks || ""}
          onChange={(e) => setAddr("nearbyLandmarks", e.target.value)}
          icon="Navigation"
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
          placeholder="e.g. 200"
          defaultValue={initialData.max_students || 500}
          error={errors.max_students}
          icon="Users"
        />
      </div>

      <div className="flex items-center gap-3.5 py-3 border-t border-orange-500/10">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={initialData.is_active !== false}
          className="accent-orange-500 w-4 h-4 rounded cursor-pointer"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-bold text-[#3C1E0A] select-none cursor-pointer"
        >
          Activate this institute immediately
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData._id ? "Update Institute" : "Register Institute"}
        </Button>
      </div>
    </form>
  );
}
