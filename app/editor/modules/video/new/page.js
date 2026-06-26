"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import VideoModuleForm from "../../../../components/form/VideoModuleForm";
import { createVideoModule, updateModule, getModule } from "../../../../services/editorPanel";

export default function VideoModulePage() {
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
        const r = await getModule("video", editId);
        setInitialData(r.data?.data || r.data);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Failed to load module", text: err?.response?.data?.message || err.message });
        router.push("/editor/modules/video");
      } finally {
        setLoading(false);
      }
    })();
  }, [editId, isEdit, router]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateModule("video", editId, formData);
        Swal.fire({ icon: "success", title: "Video Module Updated!", timer: 1500, showConfirmButton: false });
      } else {
        await createVideoModule(formData);
        Swal.fire({ icon: "success", title: "Video Module Created!", timer: 1500, showConfirmButton: false });
      }
      router.push("/editor/modules/video");
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
        <VideoModuleForm
          initialData={initialData}
          isEdit={isEdit}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/editor/modules/video")}
          saving={saving}
        />
      </div>
    </EditorLayout>
  );
}
