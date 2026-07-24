"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../../layouts/EditorLayout";
import SubTopicForm from "../../../../components/form/SubTopicForm";
import { getSubTopic, updateSubTopic, getTopic } from "../../../../services/editorPanel";

export default function EditSubTopicPage() {
  const router = useRouter();
  const { id } = useParams();

  const [subtopic, setSubtopic] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubTopic(id)
      .then(async (res) => {
        const sub = res.data?.data || res.data;
        setSubtopic(sub);
        if (sub?.topic_id) {
          getTopic(sub.topic_id)
            .then((r) => setTopicTitle((r.data?.data || r.data)?.title || ""))
            .catch(() => {});
        }
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: "Failed to load subtopic", text: err?.response?.data?.message || err.message });
        router.push("/editor/curriculum?tab=subtopics");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const backUrl = subtopic?.topic_id
    ? `/editor/curriculum?tab=subtopics&topic_id=${subtopic.topic_id}`
    : "/editor/curriculum?tab=subtopics";

  const handleSubmit = async (data) => {
    try {
      await updateSubTopic(id, { ...data, topic_id: subtopic.topic_id });
      Swal.fire({ icon: "success", title: "SubTopic Updated", timer: 1500, showConfirmButton: false });
      router.push(backUrl);
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
        <SubTopicForm
          initialData={subtopic}
          topicTitle={topicTitle}
          onSuccess={handleSubmit}
          onCancel={() => router.push(backUrl)}
        />
      </div>
    </EditorLayout>
  );
}
