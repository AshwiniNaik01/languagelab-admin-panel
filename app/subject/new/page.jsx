"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../layouts/AdminLayout";
import SubjectForm from "../../components/form/SubjectForm";
import { createSubject } from "../../services/subject";

export default function CreateSubject() {
  const router = useRouter();

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setApiError("");
    setIsSubmitting(true);

    try {
      await createSubject(formData);

      router.push("/subject");
    } catch (err) {
      console.error("Create subject error:", err);

      setApiError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to create subject. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#FFF7F2] p-6 flex items-center justify-center">

        <SubjectForm
          mode="create"
          initialData={{
            title: "",
            description: "",
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