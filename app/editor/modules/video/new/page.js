"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import VideoModuleForm from "../../../../components/form/VideoModuleForm";
import { createVideoModule } from "../../../../services/editorPanel";

export default function AddVideoModulePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await createVideoModule(formData);
      Swal.fire({ icon: "success", title: "Video Module Created!", timer: 1500, showConfirmButton: false });
      router.push("/editor/modules/video");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-4xl mx-auto">
        <VideoModuleForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/editor/modules/video")}
          saving={saving}
        />
      </div>
    </EditorLayout>
  );
}
