'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import AdminLayout from '../layouts/AdminLayout';
import ScrollableTable from '../components/Table';
import Button from '../components/ui/Button';
import InstituteForm from '../components/form/InstituteForm';
import {
    getInstitutes,
    createInstitute,
    updateInstitute,
    deleteInstitute,
    toggleInstituteStatus,
    generateLicense,
    getCourses,
} from '../services/institute';
import { KeyRound } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionIconButton';

export default function InstitutesPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('manage');
    const [institutes, setInstitutes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingInstitute, setEditingInstitute] = useState(null);

    // Generate license modal
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [licenseCount, setLicenseCount] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [licenseLoading, setLicenseLoading] = useState(false);

    // License result (shown once)
    const [generatedLicenses, setGeneratedLicenses] = useState(null);

    useEffect(() => {
        loadInstitutes();
        loadCourses();
    }, []);

    const loadInstitutes = async () => {
        setLoading(true);
        try {
            const res = await getInstitutes();
            const list = res.data?.data || res.data || [];
            setInstitutes(Array.isArray(list) ? list : []);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to load institutes', text: err?.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    const loadCourses = async () => {
        try {
            const res = await getCourses();
            const list = res.data?.data || res.data || [];
            setCourses(Array.isArray(list) ? list : []);
        } catch { /* non-blocking */ }
    };

    // ── Create ──────────────────────────────────────────────────────────────
    const handleCreateSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await createInstitute(data);
            const created = res.data?.data || res.data;
            setInstitutes((prev) => [...prev, created]);
            setActiveTab('manage');
            Swal.fire({ icon: 'success', title: 'Institute Created', text: `${data.institute_name} has been registered.`, timer: 2000, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Creation Failed', text: err?.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    // ── Edit ────────────────────────────────────────────────────────────────
    const handleEditSubmit = async (data) => {
        setLoading(true);
        try {
            await updateInstitute(editingInstitute._id, data);
            setInstitutes((prev) => prev.map((c) => c._id === editingInstitute._id ? { ...c, ...data } : c));
            setEditingInstitute(null);
            setActiveTab('manage');
            Swal.fire({ icon: 'success', title: 'Institute Updated', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Update Failed', text: err?.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    // ── Delete ──────────────────────────────────────────────────────────────
    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: `Delete ${name}?`,
            text: 'This will deactivate the institute.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete',
        });
        if (!result.isConfirmed) return;
        try {
            await deleteInstitute(id);
            setInstitutes((prev) => prev.filter((c) => c._id !== id));
            Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Delete Failed', text: err?.response?.data?.message || err.message });
        }
    };

    // ── Toggle status ───────────────────────────────────────────────────────
    const handleToggleActive = async (id) => {
        try {
            await toggleInstituteStatus(id);
            setInstitutes((prev) => prev.map((c) => c._id === id ? { ...c, is_active: !c.is_active } : c));
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Toggle Failed', text: err?.response?.data?.message || err.message });
        }
    };

    // ── Generate license ────────────────────────────────────────────────────
    const openGenerateModal = (institute) => {
        setSelectedInstitute(institute);
        setLicenseCount(1);
        setStartDate('');
        setEndDate('');
        setShowGenerateModal(true);
    };

    const handleGenerateLicense = async () => {
        if (!licenseCount || licenseCount < 1) {
            Swal.fire({ icon: 'warning', title: 'Enter at least 1 license' });
            return;
        }
        if (!startDate || !endDate) {
            Swal.fire({ icon: 'warning', title: 'Select start and expiry dates' });
            return;
        }
        setLicenseLoading(true);
        try {
            const res = await generateLicense(selectedInstitute._id, {
                license_count: licenseCount,
                start_date: startDate,
                expiry_date: endDate,
            });
            setShowGenerateModal(false);
            const payload = res.data?.data || res.data;
            setGeneratedLicenses(payload);
            loadInstitutes();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'License Generation Failed', text: err?.response?.data?.message || err.message });
        } finally {
            setLicenseLoading(false);
        }
    };

    // ── Table columns ───────────────────────────────────────────────────────
    const columns = [
        {
            header: 'Institute Name & Code',
            accessor: (row) => (
                <button
                    onClick={() => router.push(`/institutes/${row._id}`)}
                    className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity cursor-pointer"
                >
                    {row.logo ? (
                        <img src={row.logo} alt="Logo" className="w-10 h-10 object-cover rounded-xl border border-orange-200 bg-white shrink-0" />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-sm shrink-0">
                            {(row.institute_name || '??').substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div className="font-bold text-slate-950 hover:text-orange-600 transition-colors">{row.institute_name}</div>
                        <div className="text-xs text-orange-600 font-mono font-extrabold">{row.institute_code}</div>
                    </div>
                </button>
            ),
        },
        {
            header: 'Contact',
            accessor: (row) => (
                <div className="text-xs">
                    <div className="text-slate-900 font-semibold">{row.email}</div>
                    <div className="text-slate-500 font-medium">{row.phone || '—'}</div>
                </div>
            ),
        },
        {
            header: 'Website',
            accessor: (row) =>
                row.website ? (
                    <a href={row.website} target="_blank" rel="noreferrer" className="text-orange-600 font-bold hover:underline text-xs truncate max-w-30 block">
                        {row.website}
                    </a>
                ) : (
                    <span className="text-xs text-slate-400">—</span>
                ),
        },
        {
            header: 'Max Students',
            accessor: (row) => <span className="font-extrabold text-slate-950">{row.max_students}</span>,
        },
        {
            header: 'Status',
            accessor: (row) => (
                <span
                    onClick={() => handleToggleActive(row._id)}
                    className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full cursor-pointer select-none transition-all ${
                        row.is_active
                            ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                    }`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.is_active ? 'bg-green-500' : 'bg-slate-400'}`} />
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: (row) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openGenerateModal(row)}
                        title="Generate License Keys"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 text-[11px] font-bold whitespace-nowrap"
                    >
                        <KeyRound size={12} strokeWidth={2.5} />
                        <span>License</span>
                    </button>
                    <ActionButton
                        onEdit={() => { setEditingInstitute(row); setActiveTab('edit'); }}
                        onDelete={() => handleDelete(row._id, row.institute_name)}
                    />
                </div>
            ),
        },
    ];

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <AdminLayout>
            <div className="space-y-6">
                {activeTab === 'manage' && (
                    <div>
                        <h2 className="text-2xl font-black text-slate-950">Affiliated Institutes</h2>
                        <p className="text-xs font-semibold text-slate-500 mt-1">
                            Manage all institutes utilizing Language Lab licenses.
                        </p>
                    </div>
                )}

                {activeTab === 'create' ? (
                    <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
                        <InstituteForm
                            courses={courses}
                            onSubmit={handleCreateSubmit}
                            onCancel={() => setActiveTab('manage')}
                        />
                    </div>
                ) : activeTab === 'edit' && editingInstitute ? (
                    <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
                        <InstituteForm
                            initialData={editingInstitute}
                            courses={courses}
                            onSubmit={handleEditSubmit}
                            onCancel={() => { setActiveTab('manage'); setEditingInstitute(null); }}
                        />
                    </div>
                ) : (
                    <ScrollableTable columns={columns} data={institutes} loading={loading} />
                )}
            </div>

            {/* ── GENERATE LICENSE MODAL ────────────────────────────────────── */}
            {showGenerateModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-bold mb-1">Generate License Keys</h3>
                        <p className="text-sm mb-5 text-orange-600 font-semibold">{selectedInstitute?.institute_name}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Number of License Keys</label>
                                <div className="flex items-center gap-3">
                                    <button type="button" className="w-10 h-10 rounded-xl border border-orange-200 font-bold text-lg hover:bg-orange-50 transition" onClick={() => setLicenseCount((v) => Math.max(1, v - 1))}>−</button>
                                    <input type="number" min="1" value={licenseCount} onChange={(e) => setLicenseCount(Number(e.target.value))} className="flex-1 border border-orange-200 rounded-xl px-3 py-2 text-center font-bold" />
                                    <button type="button" className="w-10 h-10 rounded-xl bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 transition" onClick={() => setLicenseCount((v) => v + 1)}>+</button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Each key = 1 concurrent seat. {licenseCount} key{licenseCount > 1 ? 's' : ''} = {licenseCount} seat{licenseCount > 1 ? 's' : ''}.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Start Date</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500" />
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
                            ⚠ Passwords are shown ONCE after generation. Save them immediately — they cannot be retrieved again.
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>Cancel</Button>
                            <Button onClick={handleGenerateLicense} disabled={licenseLoading}>
                                {licenseLoading ? 'Generating…' : 'Generate Keys'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── LICENSE RESULT MODAL (shown ONCE) ────────────────────────── */}
            {generatedLicenses && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-black text-green-700">License Keys Generated ✓</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Institute: <strong>{generatedLicenses.institute_code}</strong> &nbsp;·&nbsp;
                                    {generatedLicenses.license_count} key{generatedLicenses.license_count > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 font-bold">
                            ⚠ CRITICAL — Passwords shown ONCE only. Copy and save now. Cannot be retrieved again.
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="grid grid-cols-5 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-wider px-2">
                                <span>#</span><span>License Code</span><span>User ID</span><span>Password</span><span>Status</span>
                            </div>
                            {generatedLicenses.licenses?.map((lic) => (
                                <div key={lic.key_index} className="grid grid-cols-5 gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 text-xs items-center">
                                    <span className="font-black text-green-700">{lic.key_index}</span>
                                    <span className="font-mono font-bold text-slate-800">{lic.license_code}</span>
                                    <span className="font-mono font-bold text-purple-700">{lic.user_id}</span>
                                    <span className="font-mono font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg">{lic.password}</span>
                                    <span className="text-green-700 font-bold capitalize">{lic.status}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                            <p className="text-xs font-bold text-slate-600 mb-1">Full License Keys (for records)</p>
                            {generatedLicenses.licenses?.map((lic) => (
                                <div key={lic.key_index} className="text-[11px] font-mono text-slate-500 truncate">
                                    {lic.license_code}: {lic.license_key}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={() => setGeneratedLicenses(null)}>I have saved the passwords — Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
