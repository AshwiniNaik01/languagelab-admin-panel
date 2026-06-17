"use client";

import { useState } from "react";
import TeacherLayout from "../../layouts/TeacherLayout";
import ScrollableTable from "../../components/Table";
import Button from "../../components/ui/Button";
import ContentForm from "../../components/form/ContentForm";
import MediaModulesForm from "../../components/form/MediaModulesForm";
import { initialTopics, initialSubTopics } from "../../services/dbService";

export default function TeacherCurriculumPage() {
  const [topics, setTopics] = useState(initialTopics);
  const [subtopics, setSubtopics] = useState(initialSubTopics);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState("topic"); // topic, subtopic, module

  const handleOpenCreateTopic = () => {
    setFormType("topic");
    setIsFormOpen(true);
  };

  const handleOpenCreateSubtopic = () => {
    setFormType("subtopic");
    setIsFormOpen(true);
  };

  const handleOpenCreateModule = () => {
    setFormType("module");
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
    alert(`Media module submitted successfully!\nTitle: ${data.title}\nType: ${data.module_type}`);
    setIsFormOpen(false);
  };

  const topicColumns = [
    {
      header: "Topic Title & Goal Description",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-800">{row.title}</div>
          <div className="text-xs text-gray-500 max-w-md truncate">{row.description || "No description provided"}</div>
        </div>
      )
    },
    {
      header: "Display Order",
      accessor: (row) => <span className="font-semibold text-orange-500">#{row.order}</span>
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
    }
  ];

  const subtopicColumns = [
    {
      header: "Subtopic Title",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-800">{row.title}</div>
          <div className="text-xs text-gray-400 max-w-md truncate">{row.description}</div>
        </div>
      )
    },
    {
      header: "Parent Topic ID Ref",
      accessor: (row) => <span className="text-xs font-mono font-semibold text-orange-600">{row.topic_id}</span>
    },
    {
      header: "Order Index",
      accessor: (row) => <span className="font-mono text-gray-600">{row.order}</span>
    }
  ];

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Syllabus Curriculum & Media Modules</h2>
            <p className="text-sm text-gray-500">Curate audio modules, video modules, text passages, exercise modules, and vocabulary terms lists.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleOpenCreateTopic}>
              + Topic
            </Button>
            <Button size="sm" variant="secondary" onClick={handleOpenCreateSubtopic}>
              + Subtopic
            </Button>
            <Button size="sm" onClick={handleOpenCreateModule}>
              + Interactive Media Module
            </Button>
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
            {formType === "topic" && (
              <ContentForm onSubmit={handleTopicSubmit} onCancel={() => setIsFormOpen(false)} />
            )}
            {formType === "subtopic" && (
              <ContentForm type="subtopic" onSubmit={handleSubtopicSubmit} onCancel={() => setIsFormOpen(false)} />
            )}
            {formType === "module" && (
              <MediaModulesForm onSubmit={handleModuleSubmit} onCancel={() => setIsFormOpen(false)} />
            )}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">All Topics</h3>
          <ScrollableTable columns={topicColumns} data={topics} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">All Subtopics</h3>
          <ScrollableTable columns={subtopicColumns} data={subtopics} />
        </div>
      </div>
    </TeacherLayout>
  );
}
