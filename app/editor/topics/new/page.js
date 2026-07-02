"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../layouts/EditorLayout";
import TopicForm from "../../../components/form/TopicForm";
import { createTopic } from "../../../services/editorPanel";

export default function AddTopicPage() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      await createTopic(data);
      Swal.fire({ icon: "success", title: "Topic Created", timer: 1500, showConfirmButton: false });
      router.push("/editor/curriculum?tab=topics");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Creation Failed", text: err?.response?.data?.message || err.message });
    }
  };

  return (
    <EditorLayout>
      <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
        <TopicForm onSuccess={handleSubmit} onCancel={() => router.push("/editor/curriculum?tab=topics")} />
      </div>
    </EditorLayout>
  );
}
