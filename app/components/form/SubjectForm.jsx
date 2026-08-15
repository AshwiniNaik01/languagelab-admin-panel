"use client";

import { useState } from "react";
import { BookOpen, AlignLeft } from "lucide-react";

export default function SubjectForm({
  initialData = {},
  mode = "create",
  onSubmit,
  onCancel,
  isSubmitting = false,
  apiError = "",
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "title" && error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Subject title is required.");
      return;
    }

    setError("");

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
  };

  const isEdit = mode === "edit";

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#FFF8F4] px-5 py-5 sm:px-8 md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-5xl flex-col justify-center">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500">
              Subject Management
            </p>

            <h1 className="text-xl font-black tracking-tight text-[#3C1E0A] sm:text-2xl">
              {isEdit ? "Edit Subject" : "Create New Subject"}
            </h1>

            <p className="mt-0.5 text-xs text-orange-900/50">
              {isEdit
                ? "Update the subject details below."
                : "Add a new subject to your assessment system."}
            </p>
          </div>

          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-orange-100 sm:flex">
            <BookOpen
              size={19}
              className="text-orange-600"
            />
          </div>
        </div>

        {/* =========================
            FORM CARD
        ========================= */}
        <div className="w-full overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_12px_40px_-24px_rgba(234,88,12,0.35)]">

          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6 md:p-7"
          >

            {/* =========================
                FORM FIELDS
            ========================= */}
            <div className="space-y-5">

              {/* SUBJECT TITLE */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#3C1E0A]">
                  Subject Title{" "}
                  <span className="text-orange-500">*</span>
                </label>

                <div className="relative">
                  <BookOpen
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400"
                  />

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. English Grammar"
                    className={`h-11 w-full rounded-xl border bg-orange-50/20 pl-10 pr-4 text-sm font-medium text-[#3C1E0A] outline-none transition ${
                      error
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-orange-200 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                </div>

                {error && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {error}
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#3C1E0A]">
                  Description{" "}
                  <span className="font-normal text-orange-900/40">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <AlignLeft
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-orange-400"
                  />

                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the subject"
                    className="h-24 w-full resize-none rounded-xl border border-orange-200 bg-orange-50/20 py-3 pl-10 pr-4 text-sm font-medium leading-5 text-[#3C1E0A] outline-none transition placeholder:text-orange-900/30 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

            </div>

            {/* =========================
                API ERROR
            ========================= */}
            {apiError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600">
                {apiError}
              </div>
            )}

            {/* =========================
                FOOTER
            ========================= */}
            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-orange-100 pt-5">

              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="rounded-xl border border-orange-200 bg-white px-5 py-2.5 text-xs font-bold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Subject"
                  : "Create Subject"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}