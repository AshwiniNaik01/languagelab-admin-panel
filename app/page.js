"use client";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <AdminLayout>
      <Dashboard />                 
    </AdminLayout>
  );
}