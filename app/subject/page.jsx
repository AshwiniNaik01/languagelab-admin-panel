"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Plus,
  Search,
  Power,
  X,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import {
  getSubjects,
  deleteSubject,
} from "../services/subject";

const getSubjectArray = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.subjects)) {
    return data.subjects;
  }

  return [];
};

export default function AssignmentSubjectsPage() {
  const router = useRouter();

  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  // =========================
  // GET SUBJECTS
  // =========================
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await getSubjects();

        console.log("Subjects API response:", response.data);

        const subjectList = getSubjectArray(response);

        setSubjects(subjectList);
      } catch (error) {
        console.error("Get subjects error:", error);

        setApiError(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Failed to load subjects."
        );

        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const filteredSubjects = subjects.filter((subject) =>
    subject.title?.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // VIEW
  // =========================
  const handleView = (subject) => {
    setSelectedSubject(subject);
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (subject) => {
    router.push(`/subject/${subject._id}/edit`);
  };

  // =========================
  // DELETE / DEACTIVATE
  // =========================
  const handleDelete = async (subject) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${subject.title}"?`
    );

    if (!confirmed) return;

    try {
      setApiError("");

      await deleteSubject(subject._id);

      setSubjects((prev) =>
        prev.filter((item) => item._id !== subject._id)
      );
    } catch (error) {
      console.error("Delete subject error:", error);

      setApiError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to delete subject."
      );
    }
  };

  const columns = [
    {
      header: "Subject",
      accessor: (subject) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <ClipboardList
              size={18}
              className="text-orange-600"
            />
          </div>

          <div>
            <p className="text-sm font-black text-[#3C1E0A]">
              {subject.title}
            </p>

            <p className="text-[11px] text-orange-900/40">
              Subject
            </p>
          </div>
        </div>
      ),
    },

    {
      header: "Description",
      accessor: (subject) => (
        <p className="text-sm text-orange-900/60 truncate max-w-[450px]">
          {subject.description || "No description"}
        </p>
      ),
    },

    {
      header: "Actions",
      accessor: (subject) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleView(subject)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
          >
            View
          </button>

          <button
            type="button"
            onClick={() => handleEdit(subject)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDelete(subject)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-full bg-[#FFF8F4] p-6 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* =========================
              SMALL HEADER ONLY
          ========================= */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 shadow-md shadow-orange-500/20">
                <ClipboardList
                  size={21}
                  className="text-[#3C1E0A]"
                />
              </div>

              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#3C1E0A]">
                  Subjects
                </h1>

                <p className="text-xs text-orange-900/60 mt-0.5">
                  Manage subjects for your MCQ assessments.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/subject/new")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-[#3C1E0A] text-xs font-black shadow-md shadow-orange-500/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={16} />
              Add Subject
            </button>
          </div>

          {/* =========================
              SEARCH - UNCHANGED
          ========================= */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 mb-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-orange-100 bg-orange-50/30 text-sm font-medium text-[#3C1E0A] placeholder:text-orange-900/30 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
          </div>

          {/* ERROR */}
          {apiError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
              {apiError}
            </div>
          )}

          {/* TABLE - UNCHANGED */}
          <ScrollableTable
            columns={columns}
            data={filteredSubjects}
            maxHeight="600px"
            loading={loading}
            emptyMessage="No assignment subjects found."
          />

          {/* =========================
              MODIFIED VIEW POPUP ONLY
          ========================= */}
          {selectedSubject && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedSubject(null)}
            >
              <div
                className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >

                {/* Top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

                <div className="p-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100">
                        <ClipboardList
                          size={21}
                          className="text-orange-500"
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500">
                          Subject Details
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          Assessment subject
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSubject(null)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Subject */}
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Subject
                    </p>

                    <h2 className="text-xl font-black leading-snug text-slate-900 break-words">
                      {selectedSubject.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <div className="mt-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Description
                    </p>

                    <div className="max-h-40 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm leading-6 text-slate-600 whitespace-pre-line">
                        {selectedSubject.description || (
                          <span className="italic text-slate-400">
                            No description provided.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedSubject(null)}
                      className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-sm shadow-orange-500/20 hover:bg-orange-600 transition active:scale-95"
                    >
                      Close
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}