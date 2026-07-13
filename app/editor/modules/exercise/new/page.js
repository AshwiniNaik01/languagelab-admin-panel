"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import EditorLayout from "../../../../layouts/EditorLayout";
import { createExerciseModule, updateModule, getModule } from "../../../../services/editorPanel";
import { swalSuccess, swalError } from "../../../../utils/swal";

const ExerciseModuleForm = dynamic(
  () => import("../../../../components/form/ExerciseModuleForm"),
  { ssr: false, loading: () => <div className="animate-pulse h-96 bg-slate-100 rounded-3xl" /> }
);

const PARENT_LABELS = {
  text: "Text Module",
  video: "Video Module",
  audio: "Audio Module",
  vocabulary: "Vocabulary Module",
};

export default function ExerciseModulePage() {
  const router          = useRouter();
  const searchParams    = useSearchParams();
  const editId          = searchParams.get("id");
  const isEdit          = Boolean(editId);
  const contentModuleId = searchParams.get("content_module_id");
  const parentType      = searchParams.get("parent_type");
  const isAttached      = Boolean(contentModuleId && parentType && !isEdit);

  const [saving,        setSaving]        = useState(false);
  const [initialData,   setInitialData]   = useState(null);
  const [parentModule,  setParentModule]  = useState(null);
  const [loading,       setLoading]       = useState(isEdit || isAttached);

  const backUrl = isAttached
    ? `/editor/modules/exercise?content_module_id=${contentModuleId}&parent_type=${parentType}`
    : "/editor/modules/exercise";

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const r = await getModule("exercise", editId);
          setInitialData(r.data?.data || r.data);
        } catch (err) {
          await swalError("Failed to load module", err?.response?.data?.message || err.message);
          router.push("/editor/modules/exercise");
        } finally { setLoading(false); }
      })();
      return;
    }
    if (isAttached) {
      (async () => {
        try {
          const r = await getModule(parentType, contentModuleId);
          const mod = r.data?.data || r.data;
          setParentModule(mod);
          setInitialData({ topic_id: mod.topic_id, sub_topic_id: mod.sub_topic_id });
        } catch (err) {
          await swalError("Failed to load module", err?.response?.data?.message || err.message);
          router.push("/editor/modules/exercise");
        } finally { setLoading(false); }
      })();
    }
  }, [editId, isEdit, isAttached, parentType, contentModuleId, router]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateModule("exercise", editId, data);
        await swalSuccess("Exercise Module Updated!");
      } else {
        await createExerciseModule(data);
        await swalSuccess("Exercise Module Created!");
      }
      router.push(backUrl);
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
          <ExerciseModuleForm
            initialData={initialData}
            isEdit={isEdit}
            onSubmit={handleSubmit}
            onCancel={() => router.push(backUrl)}
            saving={saving}
            lockTopicSubtopic={isAttached}
            contentModuleId={isAttached ? contentModuleId : null}
            contentModuleLabel={
              isAttached && parentModule
                ? `${PARENT_LABELS[parentType] || parentType}: ${parentModule.title}`
                : null
            }
          />
        </Suspense>
      </div>
    </EditorLayout>
  );
}
