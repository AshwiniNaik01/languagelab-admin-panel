"use client";

import { useState } from "react";
import EditorLayout from "../../layouts/EditorLayout";
import ContentForm from "../../components/form/ContentForm";
import MediaModulesForm from "../../components/form/MediaModulesForm";
import Button from "../../components/ui/Button";
import { initialTopics, initialSubTopics } from "../../services/dbService";
import { FiPlus, FiFolder, FiX, FiSearch } from "react-icons/fi";

export default function EditorCurriculumPage() {
  const [topics] = useState(initialTopics);
  const [subtopics, setSubtopics] = useState(initialSubTopics);

  const [selectedTopic, setSelectedTopic] = useState(
    initialTopics[0]?._id || null
  );

  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");

  const open = (t) => setModal(t);
  const close = () => setModal(null);

  const addSubtopic = (data) => {
    setSubtopics((prev) => [
      ...prev,
      { _id: "sub_" + Date.now(), ...data }
    ]);
    close();
  };

  const deleteSubtopic = (id) => {
    setSubtopics((prev) => prev.filter((s) => s._id !== id));
  };

  const filteredSubtopics = subtopics.filter(
    (s) => s.topic_id === selectedTopic
  );

  return (
    <EditorLayout>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Curriculum Studio
            </h1>
            <p className="text-[#64748B] text-sm mt-1">
              Build structured learning content visually
            </p>
          </div>

          <button
            onClick={() => open("topic")}
            className="
              px-5 py-2 rounded-xl font-semibold text-white
              bg-[#F97316] hover:bg-[#EA580C]
              shadow-sm transition
            "
          >
            <FiPlus className="inline mr-2" />
            Add Topic
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT PANEL */}
          <div className="col-span-4 bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">

            <h2 className="font-semibold mb-3">
              Topics
            </h2>

            {/* SEARCH */}
            <div className="flex items-center bg-[#F8FAFC] px-3 py-2 rounded-xl border border-[#E5E7EB] mb-4">
              <FiSearch className="text-[#94A3B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics..."
                className="ml-2 w-full bg-transparent outline-none text-sm"
              />
            </div>

            {/* TOPICS */}
            <div className="space-y-2">
              {topics.map((t) => (
                <div
                  key={t._id}
                  onClick={() => setSelectedTopic(t._id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition border
                    ${
                      selectedTopic === t._id
                        ? "bg-[#FFF7ED] border-[#F97316] text-[#F97316]"
                        : "hover:bg-[#F8FAFC] border-transparent text-[#334155]"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <FiFolder />
                    <span className="text-sm font-medium">
                      {t.title}
                    </span>
                  </div>

                  <span className="text-xs text-[#64748B]">
                    {subtopics.filter(s => s.topic_id === t._id).length}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => open("subtopic")}
              className="
                w-full mt-4 py-2 rounded-xl text-sm font-medium
                border border-[#E5E7EB]
                hover:bg-[#F8FAFC] transition
              "
            >
              + Add Subtopic
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-8 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-semibold">
                  Subtopics
                </h2>
                <p className="text-[#64748B] text-sm">
                  Manage content under selected topic
                </p>
              </div>

              <button
                onClick={() => open("subtopic")}
                className="
                  px-4 py-2 rounded-xl font-semibold text-white
                  bg-[#F97316] hover:bg-[#EA580C]
                  transition
                "
              >
                <FiPlus className="inline mr-2" />
                Add
              </button>
            </div>

            {/* EMPTY STATE */}
            {filteredSubtopics.length === 0 ? (
              <div className="text-center py-16 text-[#94A3B8]">
                <div className="text-4xl mb-2">📚</div>
                No subtopics yet
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubtopics.map((s) => (
                  <div
                    key={s._id}
                    className="
                      flex justify-between items-center p-4 rounded-xl
                      border border-[#E5E7EB]
                      hover:bg-[#F8FAFC] transition
                    "
                  >

                    {/* LEFT */}
                    <div>
                      <p className="font-medium">
                        {s.title}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        Topic ID: {s.topic_id}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">

                      {/* EDIT */}
                      <Button
                        variant="secondary"
                        className="
                          text-xs px-3 py-1 rounded-lg
                          border border-[#E5E7EB]
                          hover:bg-[#FFF7ED]
                          hover:border-[#F97316]
                          hover:text-[#F97316]
                          transition
                        "
                        onClick={() => {
                          alert("Edit coming soon for: " + s.title);
                        }}
                      >
                        Edit
                      </Button>

                      {/* DELETE */}
                      <Button
                        className="
                          text-xs px-3 py-1 rounded-lg
                          bg-red-500 text-white
                          hover:bg-red-600 transition
                        "
                        onClick={() => deleteSubtopic(s._id)}
                      >
                        Delete
                      </Button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MODAL */}
        {modal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

            <div className="
              w-[520px] rounded-2xl p-5 relative
              bg-white border border-[#E5E7EB]
              shadow-xl
            ">

              <button
                onClick={close}
                className="absolute right-4 top-4 text-[#64748B]"
              >
                <FiX />
              </button>

              {modal === "topic" && (
                <>
                  <h2 className="text-lg font-semibold mb-3">
                    Create Topic
                  </h2>
                  <ContentForm onSubmit={close} onCancel={close} />
                </>
              )}

              {modal === "subtopic" && (
                <>
                  <h2 className="text-lg font-semibold mb-3">
                    Create Subtopic
                  </h2>
                  <ContentForm
                    type="subtopic"
                    onSubmit={addSubtopic}
                    onCancel={close}
                  />
                </>
              )}

              {modal === "module" && (
                <>
                  <h2 className="text-lg font-semibold mb-3">
                    Create Module
                  </h2>
                  <MediaModulesForm onSubmit={close} onCancel={close} />
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </EditorLayout>
  );
}