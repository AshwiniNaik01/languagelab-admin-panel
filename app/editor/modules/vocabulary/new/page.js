"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import VocabularyModuleForm from "../../../../components/form/VocabularyModuleForm";
import { createVocabularyModule } from "../../../../services/editorPanel";

export default function AddVocabularyModulePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await createVocabularyModule(data);
      Swal.fire({ icon: "success", title: "Vocabulary Module Created!", timer: 1500, showConfirmButton: false });
      router.push("/editor/modules/vocabulary");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-4xl mx-auto">
        <VocabularyModuleForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/editor/modules/vocabulary")}
          saving={saving}
        />
      </div>
    </EditorLayout>
  );
}
