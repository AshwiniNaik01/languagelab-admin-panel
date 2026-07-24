"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";
import EditorForm from "../../components/form/EditorForm";

export default function NewEditorPage() {
  const router = useRouter();

  const handleSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Editor Created",
      timer: 1500,
      showConfirmButton: false,
    });
    router.push("/editors");
  };

  return (
    <AdminLayout>
      <div>
        <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
          <EditorForm
            onSuccess={handleSuccess}
            onCancel={() => router.push("/editors")}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
