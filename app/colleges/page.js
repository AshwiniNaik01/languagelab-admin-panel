"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import ScrollableTable from "../components/Table";
import Button from "../components/ui/Button";
import CollegeForm from "../components/form/CollegeForm";
import { initialColleges } from "../services/dbService";

export default function CollegesPage() {
  const [activeTab, setActiveTab] = useState("manage"); // 'create' or 'manage'
  const [colleges, setColleges] = useState([]);

  const [prefilledData, setPrefilledData] = useState(null);

  useEffect(() => {
    // Fetch profile data for prefilling college creation/edit forms
    const fetchMeData = async () => {
      try {
        const response = await fetch(`/api/college/me`);
        if (response.ok) {
          const data = await response.json();
          setPrefilledData(data);
        }
      } catch (err) {
        console.error("Failed to fetch prefilled college/me data", err);
      }
    };
    fetchMeData();

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lab_colleges");
      if (stored) {
        setColleges(JSON.parse(stored));
      } else {
        localStorage.setItem("lab_colleges", JSON.stringify(initialColleges));
        setColleges(initialColleges);
      }
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleToggleActive = async (id, currentStatus) => {
    setLoading(true);
    try {
      // In real backend, we PUT/PATCH status
      const updatedStatus = !currentStatus;
      const response = await fetch(`/api/college`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: updatedStatus }),
      });

      // Update local storage and component state as fallback/local mock
      const updated = colleges.map(c => c._id === id ? { ...c, is_active: updatedStatus } : c);
      setColleges(updated);
      localStorage.setItem("lab_colleges", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to toggle college state", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      // API call to create college
      const response = await fetch(`/api/college`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_name: data.college_name,
          college_code: data.college_code,
          email: data.email,
          password: data.password,
          address: data.address,
          website: data.website,
          max_students: parseInt(data.max_students) || 100,
          logo: data.logo || ""
        }),
      });

      const result = await response.json().catch(() => ({}));
      
      const newCollege = {
        _id: result.id || "col_" + Date.now(),
        ...data,
        is_active: true,
        teachers: [],
        created_by: "superadmin_1"
      };

      const updated = [...colleges, newCollege];
      setColleges(updated);
      localStorage.setItem("lab_colleges", JSON.stringify(updated));
      setActiveTab("manage");
    } catch (err) {
      console.error("API error during creation, falling back to local simulation", err);
      // Fallback
      const newCollege = {
        _id: "col_" + Date.now(),
        ...data,
        is_active: true,
        teachers: [],
        created_by: "superadmin_1"
      };
      const updated = [...colleges, newCollege];
      setColleges(updated);
      localStorage.setItem("lab_colleges", JSON.stringify(updated));
      setActiveTab("manage");
    } finally {
      setLoading(false);
    }
  };

  const [editingCollege, setEditingCollege] = useState(null);
  const [viewingCollege, setViewingCollege] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this college?")) {
      const updated = colleges.filter(c => c._id !== id);
      setColleges(updated);
      localStorage.setItem("lab_colleges", JSON.stringify(updated));
    }
  };

  const handleEditSubmit = (data) => {
    const updated = colleges.map(c => c._id === editingCollege._id ? { ...c, ...data } : c);
    setColleges(updated);
    localStorage.setItem("lab_colleges", JSON.stringify(updated));
    setEditingCollege(null);
    setActiveTab("manage");
  };

  const columns = [
    {
      header: "College Name & Code",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          {row.logo ? (
            <img src={row.logo} alt="Logo" className="w-10 h-10 object-cover rounded-xl border border-orange-200 bg-white" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-sm">
              {row.college_name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-bold text-slate-950">{row.college_name}</div>
            <div className="text-xs text-orange-600 font-mono font-extrabold">{row.college_code}</div>
          </div>
        </div>
      )
    },
    {
      header: "Contact Email & Phone",
      accessor: (row) => (
        <div className="text-xs">
          <div className="text-slate-900 font-semibold">{row.email}</div>
          <div className="text-slate-500 font-medium">{row.phone || "No phone"}</div>
        </div>
      )
    },
    {
      header: "Website",
      accessor: (row) => (
        <a href={row.website} target="_blank" rel="noreferrer" className="text-orange-600 font-bold hover:underline text-xs">
          {row.website || "No site link"}
        </a>
      )
    },
    {
      header: "Max Students Limit",
      accessor: (row) => <span className="font-extrabold text-slate-950">{row.max_students}</span>
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full cursor-pointer select-none ${
          row.is_active ? "bg-orange-50 text-orange-700 border border-orange-300" : "bg-slate-100 text-slate-700 border border-slate-300"
        }`} onClick={() => handleToggleActive(row._id, row.is_active)}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" icon="Eye" onClick={() => setViewingCollege(row)}>
            View
          </Button>
          <Button size="sm" variant="primary" icon="Edit3" onClick={() => { setEditingCollege(row); setActiveTab("edit"); }}>
            Edit
          </Button>
          <Button size="sm" variant="danger" icon="Trash" onClick={() => handleDelete(row._id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Tab Header Selector */}
        <div className="flex justify-between items-center border-b border-orange-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Affiliated Colleges</h2>
            <p className="text-xs font-semibold text-slate-500">Manage all universities and colleges utilizing Language Lab keys.</p>
          </div>

          <div className="flex bg-orange-100/60 p-1 rounded-xl border border-orange-200/80">
            <button
              onClick={() => { setActiveTab("manage"); setEditingCollege(null); }}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "manage" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Manage Partner Lists
            </button>
            <button
              onClick={() => { setActiveTab("create"); setEditingCollege(null); }}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "create" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Create New Entry
            </button>
          </div>
        </div>

        {/* Tab View switching */}
        {activeTab === "create" ? (
          <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
            <CollegeForm initialData={prefilledData || {}} onSubmit={handleCreateSubmit} onCancel={() => setActiveTab("manage")} />
          </div>
        ) : activeTab === "edit" && editingCollege ? (
          <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
            <CollegeForm initialData={editingCollege} onSubmit={handleEditSubmit} onCancel={() => { setActiveTab("manage"); setEditingCollege(null); }} />
          </div>
        ) : (
          <ScrollableTable columns={columns} data={colleges} />
        )}

        {/* VIEW DETAILS MODAL */}
        {viewingCollege && (
          <div className="fixed inset-0 bg-[#3C1E0A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-orange-500/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative">
              <div className="flex justify-between items-start border-b border-orange-500/10 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  {viewingCollege.logo ? (
                    <img src={viewingCollege.logo} alt="Logo" className="w-14 h-14 object-cover rounded-2xl border border-orange-500/20" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-lg">
                      {viewingCollege.college_name.substring(0,2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-[#3C1E0A]">{viewingCollege.college_name}</h3>
                    <p className="text-xs text-orange-600 font-mono font-extrabold">{viewingCollege.college_code}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingCollege(null)}
                  className="text-orange-950/40 hover:text-[#3C1E0A] transition text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                <div>
                  <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Authorized Email</p>
                  <p className="font-bold text-[#3C1E0A] mt-1">{viewingCollege.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Website Address</p>
                  <a href={viewingCollege.website} target="_blank" rel="noreferrer" className="font-bold text-orange-600 hover:underline mt-1 block">
                    {viewingCollege.website || "N/A"}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Contact Number</p>
                  <p className="font-bold text-[#3C1E0A] mt-1">{viewingCollege.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Max Student Capacity</p>
                  <p className="font-bold text-[#3C1E0A] mt-1">{viewingCollege.max_students}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Physical Address</p>
                  <p className="font-bold text-[#3C1E0A] mt-1">{viewingCollege.address || "No address provided."}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-orange-500/10 pt-4">
                <Button variant="secondary" onClick={() => setViewingCollege(null)}>
                  Close Details
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
