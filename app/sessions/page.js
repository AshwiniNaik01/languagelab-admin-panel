"use client";

import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import { initialActiveSessions } from "../services/dbService";

export default function SessionsPage() {
  const [sessions, setSessions] = useState(initialActiveSessions);

  const handleForceLogout = (id) => {
    setSessions(prev => prev.filter(s => s._id !== id));
  };

  const columns = [
    {
      header: "Student User",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-800">{row.student_id?.full_name}</div>
          <div className="text-xs text-orange-500 font-mono">{row.student_id?.email}</div>
        </div>
      )
    },
    {
      header: "Institute affiliate",
      accessor: (row) => <span className="text-xs text-gray-700 font-semibold">{row.institute_id?.institute_name}</span>
    },
    {
      header: "JWT Auth Token",
      accessor: (row) => <span className="text-xs text-gray-400 font-mono select-all truncate block max-w-xs">{row.token}</span>
    },
    {
      header: "Session Logs",
      accessor: (row) => (
        <div className="text-xs text-gray-500">
          <div>Logged in: {new Date(row.logged_in_at).toLocaleTimeString()}</div>
          <div className="text-red-400">Expires: {new Date(row.expires_at).toLocaleTimeString()}</div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: () => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 animate-pulse">
          Live
        </span>
      )
    },
    {
      header: "Terminate",
      accessor: (row) => (
        <Button size="sm" variant="danger" onClick={() => handleForceLogout(row._id)}>
          Force Exit & Free Seat
        </Button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Live Active Sessions</h2>
          <p className="text-sm text-gray-500">Tracks active login seats in real-time. System cron clears expired keys every 5 minutes to release seats.</p>
        </div>

        <ScrollableTable columns={columns} data={sessions} />
      </div>
    </AdminLayout>
  );
}
