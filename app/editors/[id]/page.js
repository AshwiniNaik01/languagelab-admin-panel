'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import AdminLayout from '../../layouts/AdminLayout';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { getEditorById, toggleEditorStatus } from '../../services/editor';
import { ArrowLeft, Mail, Phone, Shield, Clock, Calendar, UserCheck } from 'lucide-react';

export default function EditorViewPage() {
    const { id } = useParams();
    const router = useRouter();

    const [editor, setEditor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getEditorById(id)
            .then((res) => setEditor(res.data?.data || res.data))
            .catch((err) => Swal.fire({ icon: 'error', title: 'Failed to load editor', text: err?.response?.data?.message || err.message }))
            .finally(() => setLoading(false));
    }, [id]);

    const handleToggleStatus = async () => {
        try {
            await toggleEditorStatus(id);
            setEditor((prev) => ({ ...prev, is_active: !prev.is_active, status: prev.is_active ? 'inactive' : 'active' }));
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Toggle Failed', text: err?.response?.data?.message || err.message });
        }
    };

    const fmt = (dateStr) => dateStr ? new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
                </div>
            </AdminLayout>
        );
    }

    if (!editor) {
        return (
            <AdminLayout>
                <div className="text-center py-20 text-slate-400 font-semibold">
                    Editor not found.
                    <br />
                    <button onClick={() => router.push('/editors')} className="mt-4 text-orange-500 font-bold hover:underline">
                        ← Back to Editors
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Breadcrumb */}
                <Breadcrumb items={[
                    { label: 'Editors', href: '/editors' },
                    { label: editor.full_name },
                ]} />

                {/* Profile header card */}
                <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
                    {/* Orange top bar */}
                    <div className="h-2 bg-linear-to-r from-orange-500 to-amber-400" />

                    <div className="p-6 flex items-center gap-6">
                        <button
                            onClick={() => router.push('/editors')}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors shrink-0 self-start mt-1"
                        >
                            <ArrowLeft size={16} strokeWidth={2.5} />
                        </button>

                        {/* Avatar */}
                        {editor.profilePhoto ? (
                            <img
                                src={editor.profilePhoto}
                                alt={editor.full_name}
                                className="w-20 h-20 object-cover rounded-2xl border-2 border-orange-200 shadow-md shrink-0"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center font-black text-white text-2xl shadow-md shrink-0">
                                {(editor.full_name || '??').substring(0, 2).toUpperCase()}
                            </div>
                        )}

                        {/* Name block */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-2xl font-black text-slate-950">{editor.full_name}</h2>
                                <span className="px-2.5 py-0.5 text-[11px] font-black rounded-full bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wider">
                                    {editor.role}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">{editor.email}</p>
                        </div>

                        {/* Status toggle */}
                        <span
                            onClick={handleToggleStatus}
                            className={`inline-flex items-center px-4 py-1.5 text-sm font-bold rounded-full cursor-pointer select-none transition-all shrink-0 ${
                                editor.is_active
                                    ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                                    : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full mr-2 ${editor.is_active ? 'bg-green-500' : 'bg-slate-400'}`} />
                            {editor.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Phone */}
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <Phone size={18} className="text-orange-500" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Phone</p>
                            <p className="font-bold text-slate-800 mt-0.5 truncate">{editor.phone || '—'}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <Mail size={18} className="text-orange-500" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Email</p>
                            <p className="font-bold text-slate-800 mt-0.5 truncate">{editor.email}</p>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <Shield size={18} className="text-orange-500" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Role</p>
                            <p className="font-bold text-slate-800 mt-0.5 capitalize">{editor.role}</p>
                        </div>
                    </div>

                    {/* Last login */}
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                            <Clock size={18} className="text-sky-500" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Last Login</p>
                            <p className="font-bold text-slate-800 mt-0.5 text-xs">{fmt(editor.last_login)}</p>
                        </div>
                    </div>

                    {/* Created at */}
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                            <Calendar size={18} className="text-green-500" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Created</p>
                            <p className="font-bold text-slate-800 mt-0.5 text-xs">{fmt(editor.createdAt)}</p>
                        </div>
                    </div>

                    {/* Created by */}
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                            <UserCheck size={18} className="text-amber-500" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Created By</p>
                            <p className="font-bold text-slate-800 mt-0.5 truncate">{editor.created_by?.full_name || '—'}</p>
                            <p className="text-[10px] text-slate-400 truncate">{editor.created_by?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
