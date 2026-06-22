"use client";

import { useState } from "react";
import EditorLayout from "../../layouts/EditorLayout";
import ScrollableTable from "../../components/Table";
import Button from "../../components/ui/Button";
import InputField from "../../components/form/InputField";

export default function EditorAssessmentsPage() {
  const [assessments, setAssessments] = useState([
    {
      _id: "ass1",
      title: "Pronunciation Voicing Plosives",
      type: "mcq",
      difficulty: "easy",
      questionsCount: 10,
      total_marks: 10,
      max_attempts: 3
    },
    {
      _id: "ass2",
      title: "Business English Email Etiquette",
      type: "fill_blank",
      difficulty: "medium",
      questionsCount: 5,
      total_marks: 10,
      max_attempts: 5
    }
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const newAss = {
      _id: "ass_" + Date.now(),
      title: data.title,
      type: data.exercise_type,
      difficulty: data.difficulty,
      questionsCount: Number(data.questions_count || 5),
      total_marks: Number(data.total_marks || 10),
      max_attempts: Number(data.max_attempts || 3)
    };

    setAssessments(prev => [...prev, newAss]);
    setIsFormOpen(false);
  };

  const columns = [
    {
      header: "Assessment Name",
      accessor: (row) => <span className="font-semibold text-gray-800 text-sm">{row.title}</span>
    },
    {
      header: "Format Type",
      accessor: (row) => (
        <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-orange-100 text-orange-600">
          {row.type}
        </span>
      )
    },
    {
      header: "Difficulty Level",
      accessor: (row) => <span className="text-xs font-medium text-gray-700 capitalize">{row.difficulty}</span>
    },
    {
      header: "Questions & Marks",
      accessor: (row) => (
        <span className="text-xs text-gray-600 font-semibold">
          {row.questionsCount} Qs ({row.total_marks} Marks)
        </span>
      )
    },
    {
      header: "Max Attempts Allowed",
      accessor: (row) => <span className="text-xs">{row.max_attempts} attempts</span>
    }
  ];

  return (
    <EditorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Assessments Builder</h2>
            <p className="text-sm text-gray-500">Design multiple-choice questions (MCQs), fill in the blanks, matches, and reorder assignments with strict limits.</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            + Create New Assessment
          </Button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 border-b border-orange-50 pb-2">Add Quiz Assessment</h3>
            <InputField label="Assessment Title" name="title" required />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Question Layout Type</label>
                <select name="exercise_type" className="w-full rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:outline-none" required>
                  <option value="mcq">MCQ</option>
                  <option value="fill_blank">Fill in the Blanks</option>
                  <option value="true_false">True or False</option>
                  <option value="match">Match column words</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Difficulty</label>
                <select name="difficulty" className="w-full rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:outline-none">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <InputField label="Number of Qs" name="questions_count" type="number" defaultValue="5" required />
              <InputField label="Total Marks" name="total_marks" type="number" defaultValue="10" required />
              <InputField label="Max Attempts" name="max_attempts" type="number" defaultValue="3" required />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
              <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">Create Quiz</Button>
            </div>
          </form>
        )}

        <ScrollableTable columns={columns} data={assessments} />
      </div>
    </EditorLayout>
  );
}
