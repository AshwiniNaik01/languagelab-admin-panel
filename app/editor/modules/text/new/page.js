"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import TextModuleForm from "../../../../components/form/TextModuleForm";
import { createTextModule, updateModule, getModule } from "../../../../services/editorPanel";

export default function TextModulePage() {
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
        const r = await getModule("text", editId);
        setInitialData(r.data?.data || r.data);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Failed to load module", text: err?.response?.data?.message || err.message });
        router.push("/editor/modules/text");
      } finally {
        setLoading(false);
      }
    })();
  }, [editId, isEdit, router]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateModule("text", editId, data);
        Swal.fire({ icon: "success", title: "Text Module Updated!", timer: 1500, showConfirmButton: false });
      } else {
        await createTextModule(data);
        Swal.fire({ icon: "success", title: "Text Module Created!", timer: 1500, showConfirmButton: false });
      }
      router.push("/editor/modules/text");
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
        <TextModuleForm
          initialData={initialData}
          isEdit={isEdit}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/editor/modules/text")}
          saving={saving}
        />
      </div>
    </EditorLayout>
  );
}
