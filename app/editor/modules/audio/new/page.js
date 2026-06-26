"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import AudioModuleForm from "../../../../components/form/AudioModuleForm";
import { createAudioModule } from "../../../../services/editorPanel";

export default function AddAudioModulePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await createAudioModule(formData);
      Swal.fire({ icon: "success", title: "Audio Module Created!", timer: 1500, showConfirmButton: false });
      router.push("/editor/modules/audio");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-4xl mx-auto">
        <AudioModuleForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/editor/modules/audio")}
          saving={saving}
        />
      </div>
    </EditorLayout>
  );
}
