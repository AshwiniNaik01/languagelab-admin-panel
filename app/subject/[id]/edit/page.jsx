"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AdminLayout from "../../../layouts/AdminLayout";
import SubjectForm from "../../../components/form/SubjectForm";

import {
  getSubject,
  updateSubject,
} from "../../../services/subject";

export default function EditSubject() {
  const router = useRouter();
  const params = useParams();

  const subjectId = params.id;

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  

  // =========================
  // GET SUBJECT
  // =========================
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await getSubject(subjectId);

        console.log("Subject API response:", response.data);

        const data = response?.data?.data || response?.data;

        setSubject(data);
      } catch (err) {
        console.error("Get subject error:", err);

        setApiError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load subject."
        );
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  // =========================
  // UPDATE SUBJECT
  // =========================
  const handleSubmit = async (formData) => {
    try {
      setApiError("");
      setIsSubmitting(true);

      await updateSubject(subjectId, {
        title: formData.title,
        description: formData.description,
      });

      router.push("/subject");
    } catch (err) {
      console.error("Update subject error:", err);

      setApiError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to update subject. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-[#FFF7F2] p-6 flex items-center justify-center">
          <div className="text-sm font-bold text-orange-600">
            Loading subject...
          </div>
        </div>
      </AdminLayout>
    );
  }

  // =========================
  // ERROR / NOT FOUND
  // =========================
  if (!subject) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-[#FFF7F2] p-6 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white rounded-3xl p-8 border border-red-100 shadow-sm text-center">
            <p className="text-red-600 font-bold mb-4">
              {apiError || "Subject not found."}
            </p>

            <button
              type="button"
              onClick={() => router.push("/subject")}
              className="px-6 py-2.5 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
            >
              Back to Subjects
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#FFF7F2] p-6 flex items-center justify-center">
        <SubjectForm
          mode="edit"
          initialData={{
            title: subject.title || "",
            description: subject.description || "",
          }}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/subject")}
          isSubmitting={isSubmitting}
          apiError={apiError}
        />
      </div>
    </AdminLayout>
  );
}