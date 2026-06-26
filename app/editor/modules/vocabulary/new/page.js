"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import EditorLayout from "../../../../layouts/EditorLayout";
import { createVocabularyModule, updateModule, getModule } from "../../../../services/editorPanel";
import { swalSuccess, swalError } from "../../../../utils/swal";

const VocabularyModuleForm = dynamic(
  () => import("../../../../components/form/VocabularyModuleForm"),
  { ssr: false, loading: () => <div className="animate-pulse h-96 bg-slate-100 rounded-3xl" /> }
);

export default function VocabularyModulePage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const editId       = searchParams.get("id");
  const isEdit       = Boolean(editId);

  const [saving,      setSaving]      = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [loading,     setLoading]     = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const r = await getModule("vocabulary", editId);
        setInitialData(r.data?.data || r.data);
      } catch (err) {
        await swalError("Failed to load module", err?.response?.data?.message || err.message);
        router.push("/editor/modules/vocabulary");
      } finally { setLoading(false); }
    })();
  }, [editId, isEdit, router]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateModule("vocabulary", editId, data);
        await swalSuccess("Vocabulary Module Updated!");
      } else {
        await createVocabularyModule(data);
        await swalSuccess("Vocabulary Module Created!");
      }
      router.push("/editor/modules/vocabulary");
    } catch (err) {
      await swalError(isEdit ? "Update Failed" : "Create Failed", err?.response?.data?.message || err.message);
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <EditorLayout>
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading module…</div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout>
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div className="animate-pulse h-96 bg-slate-100 rounded-3xl" />}>
          <VocabularyModuleForm
            initialData={initialData}
            isEdit={isEdit}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/editor/modules/vocabulary")}
            saving={saving}
          />
        </Suspense>
      </div>
    </EditorLayout>
  );
}
