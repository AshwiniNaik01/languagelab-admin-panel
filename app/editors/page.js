'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../layouts/AdminLayout';
import ScrollableTable from '../components/Table';
import Button from '../components/ui/Button';
import EditorForm from '../components/form/EditorForm';
import { ActionButton } from '../components/ui/ActionIconButton';
import { getEditors, toggleEditorStatus, deleteEditor, assignEditorInstitutes } from '../services/editor';
import { getInstitutes } from '../services/institute';

export default function EditorsPage() {
    const [activeTab, setActiveTab] = useState('manage');
    const [editors, setEditors] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [editingEditor, setEditingEditor] = useState(null);
    const [viewingEditor, setViewingEditor] = useState(null);
    const [loading, setLoading] = useState(false);

    // Assign institute modal state
    const [assignEditor, setAssignEditor] = useState(null);
    const [selectedInstituteIds, setSelectedInstituteIds] = useState([]);
    const [assigning, setAssigning] = useState(false);

    const loadEditors = async () => {
        setLoading(true);
        try {
            const res = await getEditors();
            setEditors(res.data?.data || res.data || []);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to load editors', text: err?.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    const loadInstitutes = async () => {
        try {
            const res = await getInstitutes();
            const list = res.data?.data || res.data || [];
            setInstitutes(Array.isArray(list) ? list : []);
        } catch { /* non-blocking */ }
    };

    useEffect(() => {
        const init = async () => {
            await loadEditors();
            await loadInstitutes();
        };
        init();
    }, []);

    const handleEditSubmit = () => {
        setEditingEditor(null);
        setActiveTab('manage');
        loadEditors();
    };

    const handleToggleStatus = async (editor) => {
        try {
            await toggleEditorStatus(editor._id);
            setEditors((prev) =>
                prev.map((e) =>
                    e._id === editor._id
                        ? { ...e, is_active: !e.is_active, status: !e.is_active ? 'active' : 'inactive' }
                        : e,
                ),
            );
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Toggle Failed', text: err?.response?.data?.message || err.message });
        }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: `Delete ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete',
        });
        if (!result.isConfirmed) return;
        try {
            await deleteEditor(id);
            setEditors((prev) => prev.filter((e) => e._id !== id));
            Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Delete Failed', text: err?.response?.data?.message || err.message });
        }
    };

    const toggleInstituteSelect = (id) => {
        setSelectedInstituteIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const handleAssignSubmit = async () => {
        setAssigning(true);
        try {
            await assignEditorInstitutes(assignEditor._id, selectedInstituteIds);
            setEditors((prev) =>
                prev.map((e) =>
                    e._id === assignEditor._id
                        ? { ...e, assigned_institutes: selectedInstituteIds }
                        : e,
                ),
            );
            setAssignEditor(null);
            Swal.fire({ icon: 'success', title: 'Institutes Assigned', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Assignment Failed', text: err?.response?.data?.message || err.message });
        } finally {
            setAssigning(false);
        }
    };

    const columns = [
        {
            header: 'Editor',
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    {row.profilePhoto ? (
                        <img src={row.profilePhoto} alt="Photo" className="w-10 h-10 object-cover rounded-xl border border-orange-200 bg-white" />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-sm shrink-0">
                            {(row.full_name || '??').substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div className="font-bold text-slate-950">{row.full_name}</div>
                        <div className="text-xs text-slate-500 font-medium">{row.email}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Phone',
            accessor: (row) => (
                <span className="text-xs font-semibold text-slate-600">{row.phone || '—'}</span>
            ),
        },
        {
            header: 'Status',
            accessor: (row) => (
                <span
                    onClick={() => handleToggleStatus(row)}
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
                <ActionButton
                    onView={() => setViewingEditor(row)}
                    onEdit={() => { setEditingEditor(row); setActiveTab('edit'); }}
                    onDelete={() => handleDelete(row._id, row.full_name)}
                />
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {activeTab === 'manage' && (
                    <div>
                        <h2 className="text-2xl font-black text-slate-950">Editors</h2>
                        <p className="text-xs font-semibold text-slate-500 mt-1">
                            Manage editor accounts and assign them to institutes.
                        </p>
                    </div>
                )}

                {activeTab === 'edit' && editingEditor ? (
                    <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
                        <EditorForm
                            initialData={editingEditor}
                            onSubmit={handleEditSubmit}
                            onSuccess={handleEditSubmit}
                            onCancel={() => { setActiveTab('manage'); setEditingEditor(null); }}
                        />
                    </div>
                ) : (
                    <ScrollableTable columns={columns} data={editors.filter((e) => e.is_active !== false)} loading={loading} maxHeight="calc(100vh - 220px)" />
                )}
            </div>

            {/* ── VIEW EDITOR MODAL ─────────────────────────────────────── */}
            {viewingEditor && (
                <div className="fixed inset-0 bg-[#3C1E0A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-orange-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-start border-b border-orange-500/10 pb-4 mb-6">
                            <div className="flex items-center gap-4">
                                {viewingEditor.profilePhoto ? (
                                    <img src={viewingEditor.profilePhoto} alt="Photo" className="w-14 h-14 object-cover rounded-2xl border border-orange-500/20" />
                                ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-lg">
                                        {(viewingEditor.full_name || '??').substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-black text-[#3C1E0A]">{viewingEditor.full_name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{viewingEditor.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingEditor(null)}
                                className="text-slate-400 hover:text-[#3C1E0A] transition text-xl font-bold cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
                            >✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                            <div>
                                <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Phone</p>
                                <p className="font-bold text-[#3C1E0A] mt-1">{viewingEditor.phone || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Status</p>
                                <span className={`inline-flex items-center mt-1 px-3 py-1 text-xs font-bold rounded-full ${viewingEditor.is_active ? 'bg-green-50 text-green-700 border border-green-300' : 'bg-slate-100 text-slate-500 border border-slate-300'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${viewingEditor.is_active ? 'bg-green-500' : 'bg-slate-400'}`} />
                                    {viewingEditor.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Assigned Institutes</p>
                                <p className="font-bold text-[#3C1E0A] mt-1">
                                    {viewingEditor.assigned_institutes?.length
                                        ? `${viewingEditor.assigned_institutes.length} institute(s)`
                                        : 'None assigned'}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 border-t border-orange-500/10 pt-4">
                            <Button variant="secondary" onClick={() => setViewingEditor(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ASSIGN INSTITUTE MODAL ────────────────────────────────── */}
            {assignEditor && (
                <div className="fixed inset-0 bg-[#3C1E0A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-orange-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="border-b border-orange-500/10 pb-4 mb-5">
                            <h3 className="text-xl font-black text-[#3C1E0A]">Assign Institutes</h3>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                                Editor: <strong className="text-orange-700">{assignEditor.full_name}</strong>
                            </p>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {institutes.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">No institutes available.</p>
                            )}
                            {institutes.map((inst) => {
                                const checked = selectedInstituteIds.includes(inst._id);
                                return (
                                    <label
                                        key={inst._id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                            checked ? 'bg-orange-50 border-orange-400' : 'bg-white border-slate-200 hover:border-orange-200'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleInstituteSelect(inst._id)}
                                            className="accent-orange-500 w-4 h-4 shrink-0"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{inst.institute_name}</p>
                                            <p className="text-[10px] text-orange-600 font-mono font-bold">{inst.institute_code}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-orange-500/10">
                            <span className="text-xs text-slate-500 font-semibold">{selectedInstituteIds.length} selected</span>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => setAssignEditor(null)}>Cancel</Button>
                                <Button onClick={handleAssignSubmit} disabled={assigning}>
                                    {assigning ? 'Saving…' : 'Save Assignment'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
