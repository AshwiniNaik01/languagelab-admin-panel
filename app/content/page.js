"use client";

import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import ContentForm from "../components/form/ContentForm";
import MediaModulesForm from "../components/form/MediaModulesForm";
import { initialTopics, initialSubTopics, initialEditors } from "../services/dbService";

export default function ContentPage() {
  const [topics, setTopics] = useState(initialTopics);
  const [subtopics, setSubtopics] = useState(initialSubTopics);
  
  // Interactive mock states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState("topic"); // topic, subtopic, module
  const [editingData, setEditingData] = useState(null);

  const handleOpenCreateTopic = () => {
    setFormType("topic");
    setEditingData(null);
    setIsFormOpen(true);
  };

  const handleOpenCreateSubtopic = () => {
    setFormType("subtopic");
    setEditingData(null);
    setIsFormOpen(true);
  };

  const handleOpenCreateModule = () => {
    setFormType("module");
    setEditingData(null);
    setIsFormOpen(true);
  };

  const handleTopicSubmit = (data) => {
    const newTopic = {
      _id: "topic_" + Date.now(),
      ...data,
      created_by: "teach1",
      is_active: true
    };
    setTopics(prev => [...prev, newTopic]);
    setIsFormOpen(false);
  };

  const handleSubtopicSubmit = (data) => {
    const newSub = {
      _id: "sub_" + Date.now(),
      ...data,
      created_by: "teach1",
      is_active: true
    };
    setSubtopics(prev => [...prev, newSub]);
    setIsFormOpen(false);
  };

  const handleModuleSubmit = (data) => {
    alert("Module successfully saved!\nType: " + data.module_type + "\nTitle: " + data.title);
    setIsFormOpen(false);
  };

  const getEditorName = (id) => {
    const match = initialEditors.find(t => t._id === id);
    return match ? match.full_name : "General Instructor";
  };

  const topicColumns = [
    {
      header: "Topic Title & Description",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-800">{row.title}</div>
          <div className="text-xs text-gray-500 max-w-sm truncate">{row.description}</div>
        </div>
      )
    },
    {
      header: "Order Index",
      accessor: (row) => <span className="font-semibold font-mono text-orange-500">#{row.order}</span>
    },
    {
      header: "Author Instructor",
      accessor: (row) => <span className="text-xs font-semibold text-gray-700">{getEditorName(row.created_by)}</span>
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
    }
  ];

  const subtopicColumns = [
    {
      header: "Subtopic Title & Details",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-800">{row.title}</div>
          <div className="text-xs text-gray-500 max-w-sm truncate">{row.description}</div>
        </div>
      )
    },
    {
      header: "Topic Reference ID",
      accessor: (row) => <span className="text-xs font-mono font-semibold text-orange-500">{row.topic_id}</span>
    },
    {
      header: "Order inside Topic",
      accessor: (row) => <span className="font-mono text-gray-700">Order: {row.order}</span>
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Language Lab Curriculum</h2>
            <p className="text-sm text-gray-500">Design topics, structure subtopics, and add learning audio, video, text, exercise, or vocab modules.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleOpenCreateTopic}>
              + Add Topic
            </Button>
            <Button size="sm" variant="secondary" onClick={handleOpenCreateSubtopic}>
              + Add Subtopic
            </Button>
            <Button size="sm" onClick={handleOpenCreateModule}>
              + Add Media Module
            </Button>
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
            {formType === "topic" && (
              <ContentForm
                type="topic"
                initialData={editingData || {}}
                onSubmit={handleTopicSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
            {formType === "subtopic" && (
              <ContentForm
                type="subtopic"
                initialData={editingData || {}}
                onSubmit={handleSubtopicSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
            {formType === "module" && (
              <MediaModulesForm
                topic_id="topic1"
                sub_topic_id="sub1"
                onSubmit={handleModuleSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Core Topics List</h3>
          <ScrollableTable columns={topicColumns} data={topics} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Sub-Topics List</h3>
          <ScrollableTable columns={subtopicColumns} data={subtopics} />
        </div>
      </div>
    </AdminLayout>
  );
}
