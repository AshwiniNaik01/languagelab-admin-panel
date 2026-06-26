"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import TextModuleForm from "../../../../components/form/TextModuleForm";
import { createTextModule } from "../../../../services/editorPanel";

export default function AddTextModulePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await createTextModule(data);
      Swal.fire({ icon: "success", title: "Text Module Created!", timer: 1500, showConfirmButton: false });
      router.push("/editor/modules/text");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-4xl mx-auto">
        <TextModuleForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/editor/modules/text")}
          saving={saving}
        />
      </div>
    </EditorLayout>
  );
}
