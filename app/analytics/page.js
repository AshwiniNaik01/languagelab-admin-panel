"use client";

import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import { initialActivityLogs, initialStudents, initialInstitutes } from "../services/dbService";

export default function AnalyticsPage() {
  const [logs] = useState(initialActivityLogs);

  const getStudentName = (id) => {
    const match = initialStudents.find(s => s._id === id);
    return match ? match.full_name : "Student User";
  };

  const getInstituteName = (id) => {
    const match = initialInstitutes.find(c => c._id === id);
    return match ? match.institute_name : "Affiliated Institute";
  };

  const columns = [
    {
      header: "Timestamp",
      accessor: (row) => <span className="text-xs text-gray-500 font-mono">{new Date(row.logged_at).toLocaleString()}</span>
    },
    {
      header: "Student & Institute",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-800 text-xs">{getStudentName(row.student_id)}</div>
          <div className="text-[10px] text-gray-400">{getInstituteName(row.institute_id)}</div>
        </div>
      )
    },
    {
      header: "Module Context",
      accessor: (row) => (
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-orange-100 text-orange-600">
          {row.module_type}
        </span>
      )
    },
    {
      header: "Action Logged",
      accessor: (row) => <span className="text-xs font-semibold text-gray-700 font-mono">{row.activity_type}</span>
    },
    {
      header: "Time Spent / Score",
      accessor: (row) => (
        <div className="text-xs text-gray-600">
          {row.time_spent_sec ? <div>{row.time_spent_sec}s spent</div> : null}
          {row.score ? <div className="text-orange-500 font-bold">{row.score} / {row.max_score} ({row.accuracy}%)</div> : null}
        </div>
      )
    },
    {
      header: "Module Progress",
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <div className="w-10 bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full" style={{ width: `${row.progress_percent}%` }} />
          </div>
          <span className="text-[10px] font-bold text-gray-600">{row.progress_percent}%</span>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Activity Log Analytics</h2>
          <p className="text-sm text-gray-500">Real-time usage analytics of student interaction, video stream pause/play cycles, speech exercises grades, and audio logs.</p>
        </div>

        <ScrollableTable columns={columns} data={logs} />
      </div>
    </AdminLayout>
  );
}
