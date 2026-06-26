"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import ExerciseModuleForm from "../../../../components/form/ExerciseModuleForm";
import { createExerciseModule } from "../../../../services/editorPanel";

export default function AddExerciseModulePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await createExerciseModule(data);
      Swal.fire({ icon: "success", title: "Exercise Module Created!", timer: 1500, showConfirmButton: false });
      router.push("/editor/modules/exercise");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-4xl mx-auto">
        <ExerciseModuleForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/editor/modules/exercise")}
          saving={saving}
        />
      </div>
    </EditorLayout>
  );
}
