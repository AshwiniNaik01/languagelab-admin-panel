"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import VocabularyModuleForm from "../../../../components/form/VocabularyModuleForm";
import { createVocabularyModule, updateModule, getModule } from "../../../../services/editorPanel";

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
        Swal.fire({ icon: "error", title: "Failed to load module", text: err?.response?.data?.message || err.message });
        router.push("/editor/modules/vocabulary");
      } finally {
        setLoading(false);
      }
    })();
  }, [editId, isEdit, router]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateModule("vocabulary", editId, data);
        Swal.fire({ icon: "success", title: "Vocabulary Module Updated!", timer: 1500, showConfirmButton: false });
      } else {
        await createVocabularyModule(data);
        Swal.fire({ icon: "success", title: "Vocabulary Module Created!", timer: 1500, showConfirmButton: false });
      }
      router.push("/editor/modules/vocabulary");
    } catch (err) {
      Swal.fire({ icon: "error", title: isEdit ? "Update Failed" : "Create Failed", text: err?.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
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
        <VocabularyModuleForm
          initialData={initialData}
          isEdit={isEdit}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/editor/modules/vocabulary")}
          saving={saving}
        />
      </div>
    </EditorLayout>
  );
}
