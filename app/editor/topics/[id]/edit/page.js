"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import TopicForm from "../../../../components/form/TopicForm";
import { getTopic, updateTopic } from "../../../../services/editorPanel";

export default function EditTopicPage() {
  const router = useRouter();
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopic(id)
      .then((res) => setTopic(res.data?.data || res.data))
      .catch((err) => {
        Swal.fire({ icon: "error", title: "Failed to load topic", text: err?.response?.data?.message || err.message });
        router.push("/editor/curriculum?tab=topics");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await updateTopic(id, data);
      Swal.fire({ icon: "success", title: "Topic Updated", timer: 1500, showConfirmButton: false });
      router.push("/editor/curriculum?tab=topics");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update Failed", text: err?.response?.data?.message || err.message });
    }
  };

  if (loading) {
    return (
      <EditorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout>
      <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
        <TopicForm
          initialData={topic}
          onSuccess={handleSubmit}
          onCancel={() => router.push("/editor/curriculum?tab=topics")}
        />
      </div>
    </EditorLayout>
  );
}
