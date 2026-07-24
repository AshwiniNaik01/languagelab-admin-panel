"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../layouts/EditorLayout";
import SubTopicForm from "../../../components/form/SubTopicForm";
import { createSubTopic, getTopic } from "../../../services/editorPanel";

export default function AddSubTopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic_id");

  const [topicTitle, setTopicTitle] = useState("");

  useEffect(() => {
    if (topicId) {
      getTopic(topicId)
        .then((res) => setTopicTitle((res.data?.data || res.data)?.title || ""))
        .catch(() => {});
    }
  }, [topicId]);

  const backUrl = topicId
    ? `/editor/curriculum?tab=subtopics&topic_id=${topicId}`
    : "/editor/curriculum?tab=subtopics";

  const handleSubmit = async (data) => {
    if (!topicId) {
      Swal.fire({ icon: "warning", title: "No topic selected" });
      return;
    }
    try {
      await createSubTopic({ ...data, topic_id: topicId });
      Swal.fire({ icon: "success", title: "SubTopic Created", timer: 1500, showConfirmButton: false });
      router.push(backUrl);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Creation Failed", text: err?.response?.data?.message || err.message });
    }
  };

  return (
    <EditorLayout>
      <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
        <SubTopicForm
          topicTitle={topicTitle}
          onSuccess={handleSubmit}
          onCancel={() => router.push(backUrl)}
        />
      </div>
    </EditorLayout>
  );
}
