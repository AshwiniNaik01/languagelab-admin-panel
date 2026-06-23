'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import ScrollableTable from '../components/Table';
import Button from '../components/ui/Button';
import InstituteForm from '../components/form/InstituteForm';
import { initialInstitutes } from '../services/dbService';

import { FiEye, FiEdit, FiTrash2, FiKey, FiMoreVertical } from 'react-icons/fi';

export default function InstitutesPage() {
    const [activeTab, setActiveTab] = useState('manage'); // 'create' or 'manage'
    const [institutes, setInstitutes] = useState([]);

    const [prefilledData, setPrefilledData] = useState(null);

    useEffect(() => {
        // Fetch profile data for prefilling institute creation/edit forms
        const fetchMeData = async () => {
            try {
                const response = await fetch(`/api/institute`);
                if (response.ok) {
                    const data = await response.json();
                    setPrefilledData(data);
                }
            } catch (err) {
                console.error('Failed to fetch prefilled institute data', err);
            }
        };
        fetchMeData();

        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('lab_institutes');
            if (stored) {
                setInstitutes(JSON.parse(stored));
            } else {
                localStorage.setItem('lab_institutes', JSON.stringify(initialInstitutes));
                setInstitutes(initialInstitutes);
            }
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleToggleActive = async (id, currentStatus) => {
        setLoading(true);
        try {
            // In real backend, we PUT/PATCH status
            const updatedStatus = !currentStatus;
            const response = await fetch(`/api/institute`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: updatedStatus }),
            });

            // Update local storage and component state as fallback/local mock
            const updated = institutes.map((c) =>
                c._id === id ? { ...c, is_active: updatedStatus } : c,
            );
            setInstitutes(updated);
            localStorage.setItem('lab_institutes', JSON.stringify(updated));
        } catch (err) {
            console.error('Failed to toggle institute state', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubmit = async (data) => {
        setLoading(true);
        setErrorMsg('');
        try {
            // API call to create institute
            const response = await fetch(`/api/institute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    institute_name: data.institute_name,
                    institute_code: data.institute_code,
                    email: data.email,
                    password: data.password,
                    address: data.address,
                    website: data.website,
                    max_students: parseInt(data.max_students) || 100,
                    logo: data.logo || '',
                }),
            });

            const result = await response.json().catch(() => ({}));

            const newInstitute = {
                _id: result.id || 'col_' + Date.now(),
                ...data,
                is_active: true,
                teachers: [],
                created_by: 'superadmin_1',
            };

            const updated = [...institutes, newInstitute];
            setInstitutes(updated);
            localStorage.setItem('lab_institutes', JSON.stringify(updated));
            setActiveTab('manage');
        } catch (err) {
            console.error('API error during creation, falling back to local simulation', err);
            // Fallback
            const newInstitute = {
                _id: 'col_' + Date.now(),
                ...data,
                is_active: true,
                teachers: [],
                created_by: 'superadmin_1',
            };
            const updated = [...institutes, newInstitute];
            setInstitutes(updated);
            localStorage.setItem('lab_institutes', JSON.stringify(updated));
            setActiveTab('manage');
        } finally {
            setLoading(false);
        }
    };

    const [editingInstitute, setEditingInstitute] = useState(null);
    const [viewingInstitute, setViewingInstitute] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [licenseCount, setLicenseCount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this institute?')) {
            const updated = institutes.filter((c) => c._id !== id);
            setInstitutes(updated);
            localStorage.setItem('lab_institutes', JSON.stringify(updated));
        }
    };

    const handleEditSubmit = (data) => {
        const updated = institutes.map((c) =>
            c._id === editingInstitute._id ? { ...c, ...data } : c,
        );
        setInstitutes(updated);
        localStorage.setItem('lab_institutes', JSON.stringify(updated));
        setEditingInstitute(null);
        setActiveTab('manage');
    };
    const openGenerateModal = (institute) => {
        setSelectedInstitute(institute);
        setLicenseCount(0);
        setStartDate('');
        setEndDate('');
        setShowGenerateModal(true);
    };

    const handleGenerateLicense = () => {
        const storedLicenses = JSON.parse(localStorage.getItem('lab_licenses')) || [];

        const newLicense = {
            _id: 'lic_' + Date.now(),
            institute_id: selectedInstitute._id,
            institute_name: selectedInstitute.institute_name,
            total_seats: licenseCount,
            active_sessions: 0,
            start_date: startDate,
            expiry_date: endDate,
            status: 'active',
            license_code: 'LIC-' + Math.floor(Math.random() * 100000),
            license_key: 'KEY-' + Date.now(),
        };

        localStorage.setItem('lab_licenses', JSON.stringify([...storedLicenses, newLicense]));

        setShowGenerateModal(false);
    };

    const columns = [
        {
            header: 'Institute Name & Code',
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    {row.logo ? (
                        <img
                            src={row.logo}
                            alt="Logo"
                            className="w-10 h-10 object-cover rounded-xl border border-orange-200 bg-white"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-sm">
                            {row.institute_name.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div className="font-bold text-slate-950">{row.institute_name}</div>
                        <div className="text-xs text-orange-600 font-mono font-extrabold">
                            {row.institute_code}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Contact Email & Phone',
            accessor: (row) => (
                <div className="text-xs">
                    <div className="text-slate-900 font-semibold">{row.email}</div>
                    <div className="text-slate-500 font-medium">{row.phone || 'No phone'}</div>
                </div>
            ),
        },
        {
            header: 'Website',
            accessor: (row) => (
                <a
                    href={row.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 font-bold hover:underline text-xs">
                    {row.website || 'No site link'}
                </a>
            ),
        },
        {
            header: 'Max Students Limit',
            accessor: (row) => (
                <span className="font-extrabold text-slate-950">{row.max_students}</span>
            ),
        },
        {
            header: 'Status',
            accessor: (row) => (
                <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full cursor-pointer select-none ${
                        row.is_active
                            ? 'bg-orange-50 text-orange-700 border border-orange-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                    onClick={() => handleToggleActive(row._id, row.is_active)}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => openGenerateModal(row)}
                        className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100"
                        title="Generate License">
                        <FiKey size={16} />
                    </button>

                    <button
                        onClick={() => setViewingInstitute(row)}
                        className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100"
                        title="View Details">
                        <FiEye size={16} />
                    </button>

                    <button
                        onClick={() => {
                            setEditingInstitute(row);
                            setActiveTab('edit');
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="Edit">
                        <FiEdit size={16} />
                    </button>

                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        title="Delete">
                        <FiTrash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Tab Header Selector */}
                {/* <div className="flex justify-between items-center border-b border-orange-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Affiliated Institutes</h2>
            <p className="text-xs font-semibold text-slate-500">Manage all universities and institutes utilizing Language Lab keys.</p>
          </div>

          <div className="flex bg-orange-100/60 p-1 rounded-xl border border-orange-200/80">
            <button
              onClick={() => { setActiveTab("manage"); setEditingInstitute(null); }}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "manage" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Manage Partner Lists
            </button>
            <button
              onClick={() => { setActiveTab("create"); setEditingInstitute(null); }}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "create" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Create New Entry
            </button>
          </div>
        </div> */}

                {/* Tab View switching */}
                {activeTab === 'create' ? (
                    <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
                        <InstituteForm
                            initialData={prefilledData || {}}
                            onSubmit={handleCreateSubmit}
                            onCancel={() => setActiveTab('manage')}
                        />
                    </div>
                ) : activeTab === 'edit' && editingInstitute ? (
                    <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
                        <InstituteForm
                            initialData={editingInstitute}
                            onSubmit={handleEditSubmit}
                            onCancel={() => {
                                setActiveTab('manage');
                                setEditingInstitute(null);
                            }}
                        />
                    </div>
                ) : (
                    <ScrollableTable columns={columns} data={institutes} />
                )}

                {/* VIEW DETAILS MODAL */}
                {viewingInstitute && (
                    <div className="fixed inset-0 bg-[#3C1E0A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white border border-orange-500/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative">
                            <div className="flex justify-between items-start border-b border-orange-500/10 pb-4 mb-6">
                                <div className="flex items-center gap-4">
                                    {viewingInstitute.logo ? (
                                        <img
                                            src={viewingInstitute.logo}
                                            alt="Logo"
                                            className="w-14 h-14 object-cover rounded-2xl border border-orange-500/20"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-lg">
                                            {viewingInstitute.institute_name
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-black text-[#3C1E0A]">
                                            {viewingInstitute.institute_name}
                                        </h3>
                                        <p className="text-xs text-orange-600 font-mono font-extrabold">
                                            {viewingInstitute.institute_code}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingInstitute(null)}
                                    className="text-orange-950/40 hover:text-[#3C1E0A] transition text-xl font-bold cursor-pointer">
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                                <div>
                                    <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">
                                        Authorized Email
                                    </p>
                                    <p className="font-bold text-[#3C1E0A] mt-1">
                                        {viewingInstitute.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">
                                        Website Address
                                    </p>
                                    <a
                                        href={viewingInstitute.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-bold text-orange-600 hover:underline mt-1 block">
                                        {viewingInstitute.website || 'N/A'}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">
                                        Contact Number
                                    </p>
                                    <p className="font-bold text-[#3C1E0A] mt-1">
                                        {viewingInstitute.phone || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">
                                        Max Student Capacity
                                    </p>
                                    <p className="font-bold text-[#3C1E0A] mt-1">
                                        {viewingInstitute.max_students}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">
                                        Physical Address
                                    </p>
                                    <p className="font-bold text-[#3C1E0A] mt-1">
                                        {viewingInstitute.address || 'No address provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-orange-500/10 pt-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setViewingInstitute(null)}>
                                    Close Details
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showGenerateModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-bold mb-5">Generate License</h3>

                        <p className="text-sm mb-4 text-orange-600 font-semibold">
                            {selectedInstitute?.institute_name}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    License Count
                                </label>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="w-10 h-10 rounded-xl border border-orange-200"
                                        onClick={() =>
                                            setLicenseCount(Math.max(0, licenseCount - 1))
                                        }>
                                        -
                                    </button>

                                    <input
                                        type="number"
                                        value={licenseCount}
                                        onChange={(e) => setLicenseCount(Number(e.target.value))}
                                        className="flex-1 border border-orange-200 rounded-xl px-3 py-2"
                                    />

                                    <button
                                        type="button"
                                        className="w-10 h-10 rounded-xl bg-orange-500 text-white"
                                        onClick={() => setLicenseCount(licenseCount + 1)}>
                                        +
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-orange-200 rounded-xl px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Expiry Date
                                </label>

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-orange-200 rounded-xl px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
                                Cancel
                            </Button>

                            <Button variant="primary" onClick={handleGenerateLicense}>
                                Generate
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
