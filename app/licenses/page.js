'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../layouts/AdminLayout';
import { getInstitutes } from '../services/institute';
import { Eye } from 'lucide-react';
import {
    getInstituteLicenses,
    suspendLicense,
    activateLicense,
    expireLicense,
} from '../services/superadmin';

export default function LicensesPage() {
    const [institutes, setInstitutes] = useState([]);
    const [licenseMap, setLicenseMap] = useState({}); // { instituteId: [license, ...] }
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [licenseLoading, setLicenseLoading] = useState(null);
    const [viewingLicense, setViewingLicense] = useState(null);

    useEffect(() => {
        const load = async () => {
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
        load();
    }, []);

    const loadLicenses = async (instituteId) => {
        if (licenseMap[instituteId]) {
            // already loaded — just toggle expand
            setExpandedId((prev) => (prev === instituteId ? null : instituteId));
            return;
        }
        try {
            const res = await getInstituteLicenses(instituteId);
            const list = res.data?.data?.licenses || res.data?.licenses || res.data || [];
            setLicenseMap((prev) => ({ ...prev, [instituteId]: Array.isArray(list) ? list : [] }));
            setExpandedId(instituteId);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to load licenses', text: err?.response?.data?.message || err.message });
        }
    };

    const handleAction = async (licenseId, action, instituteId) => {
        const actionMap = {
            suspend: { fn: suspendLicense, label: 'Suspend', confirmText: 'Yes, suspend it' },
            activate: { fn: activateLicense, label: 'Activate', confirmText: 'Yes, activate it' },
            expire: { fn: expireLicense, label: 'Expire', confirmText: 'Yes, expire it' },
        };
        const { fn, label, confirmText } = actionMap[action];

        const result = await Swal.fire({
            title: `${label} this license?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmText,
            confirmButtonColor: action === 'activate' ? '#15803d' : '#d33',
        });
        if (!result.isConfirmed) return;

        setLicenseLoading(licenseId);
        try {
            await fn(licenseId);
            // refresh licenses for this institute
            const res = await getInstituteLicenses(instituteId);
            const list = res.data?.data?.licenses || res.data?.licenses || res.data || [];
            setLicenseMap((prev) => ({ ...prev, [instituteId]: Array.isArray(list) ? list : [] }));
            Swal.fire({ icon: 'success', title: `License ${label}d`, timer: 1200, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: `${label} Failed`, text: err?.response?.data?.message || err.message });
        } finally {
            setLicenseLoading(null);
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-50 text-green-700 border-green-300';
            case 'suspended': return 'bg-amber-50 text-amber-700 border-amber-300';
            case 'expired': return 'bg-red-50 text-red-700 border-red-300';
            case 'revoked': return 'bg-slate-100 text-slate-700 border-slate-300';
            default: return 'bg-slate-100 text-slate-700 border-slate-300';
        }
    };

    const daysLeft = (expiry) => {
        const d = Math.ceil((new Date(expiry) - new Date()) / 86400000);
        return d > 0 ? d : 0;
    };

    return (
        <>
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-950">License Keys</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                        HMAC-signed keys generated per institute. Click an institute to expand its keys.
                        Licenses are generated from the Institutes page.
                    </p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 border-r-2" />
                    </div>
                )}

                {!loading && institutes.length === 0 && (
                    <div className="text-center py-16 text-slate-400 text-sm font-semibold">
                        No institutes found. Create institutes first, then generate license keys.
                    </div>
                )}

                <div className="space-y-3">
                    {institutes.map((inst) => {
                        const isOpen = expandedId === inst._id;
                        const licenses = licenseMap[inst._id] || [];

                        return (
                            <div
                                key={inst._id}
                                className="bg-white border border-orange-500/20 rounded-2xl overflow-hidden shadow-sm"
                            >
                                {/* Institute row — sticky header */}
                                <button
                                    onClick={() => loadLicenses(inst._id)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-orange-50/50 transition-colors text-left sticky top-0 z-10 bg-white"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-sm shrink-0">
                                            {(inst.institute_name || '??').substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-950 text-sm">{inst.institute_name}</p>
                                            <p className="text-xs text-orange-600 font-mono font-bold">{inst.institute_code}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-xs text-slate-500 font-semibold">
                                        <span>
                                            <span className="font-black text-slate-800">{inst.license_count || 0}</span> keys
                                        </span>
                                        <span
                                            className={`px-2.5 py-1 rounded-full border font-bold text-xs ${
                                                inst.is_active
                                                    ? 'bg-orange-50 text-orange-700 border-orange-300'
                                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                            }`}
                                        >
                                            {inst.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className={`text-lg font-black text-orange-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </div>
                                </button>

                                {/* License keys list */}
                                {isOpen && (
                                    <div className="border-t border-orange-500/10 bg-orange-50/30 px-6 pt-3 pb-4">
                                        {licenses.length === 0 ? (
                                            <p className="text-sm text-slate-400 font-semibold text-center py-4">
                                                No license keys generated yet. Use the Institutes page to generate keys.
                                            </p>
                                        ) : (
                                            <>
                                                {/* Column headers — always visible above scroll */}
                                                <div className="grid grid-cols-5 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-wider px-2 py-2 bg-orange-50/90 rounded-lg mb-2">
                                                    <span>Code</span>
                                                    <span>License Key</span>
                                                    <span>Sessions</span>
                                                    <span>Expiry / Days Left</span>
                                                    <span>Actions</span>
                                                </div>

                                                {/* Scrollable rows only */}
                                                <div className="max-h-80 overflow-y-auto overflow-x-hidden space-y-2">
                                                {licenses.map((lic) => (
                                                    <div
                                                        key={lic._id}
                                                        className="grid grid-cols-5 gap-2 bg-white border border-orange-500/10 rounded-xl px-3 py-3 text-xs items-center"
                                                    >
                                                        {/* Code */}
                                                        <div>
                                                            <span className="font-mono font-black text-orange-700">{lic.license_code}</span>
                                                            <span className={`ml-1 px-1.5 py-0.5 rounded-full border text-[10px] font-bold ${statusColor(lic.status)}`}>
                                                                {lic.status}
                                                            </span>
                                                        </div>

                                                        {/* Key */}
                                                        <div className="font-mono text-slate-500 truncate text-[10px]">
                                                            {lic.license_key}
                                                        </div>

                                                        {/* Sessions */}
                                                        <div className="font-bold text-slate-700">
                                                            {lic.active_sessions ?? 0} / {lic.total_seats ?? 1}
                                                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                                                                <div
                                                                    className="bg-orange-500 h-full rounded-full"
                                                                    style={{
                                                                        width: `${Math.min(100, ((lic.active_sessions ?? 0) / (lic.total_seats || 1)) * 100)}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Expiry */}
                                                        <div>
                                                            <div className="font-semibold text-slate-700">
                                                                {lic.expiry_date
                                                                    ? new Date(lic.expiry_date).toLocaleDateString()
                                                                    : '—'}
                                                            </div>
                                                            <div className={`text-[10px] font-bold ${daysLeft(lic.expiry_date) <= 30 ? 'text-red-600' : 'text-orange-600'}`}>
                                                                {daysLeft(lic.expiry_date)} days left
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-1.5 flex-nowrap">
                                                            <button
                                                                onClick={() => setViewingLicense(lic)}
                                                                title="View Details"
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-sky-500 text-white cursor-pointer shrink-0"
                                                            >
                                                                <Eye size={13} strokeWidth={2.5} />
                                                            </button>
                                                            {lic.status === 'active' ? (
                                                                <button
                                                                    disabled={licenseLoading === lic._id}
                                                                    onClick={() => handleAction(lic._id, 'suspend', inst._id)}
                                                                    className="px-2 py-1 text-[10px] font-black rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-50 whitespace-nowrap"
                                                                >
                                                                    Suspend
                                                                </button>
                                                            ) : lic.status === 'suspended' ? (
                                                                <button
                                                                    disabled={licenseLoading === lic._id}
                                                                    onClick={() => handleAction(lic._id, 'activate', inst._id)}
                                                                    className="px-2 py-1 text-[10px] font-black rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50 whitespace-nowrap"
                                                                >
                                                                    Activate
                                                                </button>
                                                            ) : null}
                                                            {lic.status !== 'expired' && (
                                                                <button
                                                                    disabled={licenseLoading === lic._id}
                                                                    onClick={() => handleAction(lic._id, 'expire', inst._id)}
                                                                    className="px-2 py-1 text-[10px] font-black rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 whitespace-nowrap"
                                                                >
                                                                    Expire
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>

        {/* ── LICENSE DETAIL MODAL ─────────────────────────────────────── */}
        {viewingLicense && (() => {
            const lic = viewingLicense;
            // Derive plain password from user_id: {CODE}-U{INDEX} → {CODE}{INDEX}
            const derivedPassword = lic.user_id?.match(/^(.+)-U(\d+)$/)
                ? `${lic.user_id.match(/^(.+)-U(\d+)$/)[1]}${lic.user_id.match(/^(.+)-U(\d+)$/)[2]}`
                : '—';
            const days = lic.days_remaining ?? daysLeft(lic.expiry_date);
            const sessionPct = Math.min(100, ((lic.active_sessions ?? 0) / (lic.total_seats || 1)) * 100);
            const durationPct = Math.min(100, Math.max(0, ((lic.duration - days) / (lic.duration || 365)) * 100));

            return (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-xl bg-white/20 text-white font-black text-sm flex items-center justify-center">
                                    {lic.key_index}
                                </span>
                                <div>
                                    <p className="font-black text-white text-base">{lic.license_code}</p>
                                    <p className="text-orange-100 text-xs font-semibold">{lic.user_id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${statusColor(lic.status)}`}>
                                    {lic.status}
                                </span>
                                {lic.is_valid && (
                                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-300 text-[10px] font-black">valid</span>
                                )}
                                <button onClick={() => setViewingLicense(null)} className="ml-2 w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black text-sm cursor-pointer">✕</button>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            {/* Credentials */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-wider mb-1">User ID</p>
                                    <p className="font-mono font-black text-orange-700 text-sm break-all">{lic.user_id || '—'}</p>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-wider mb-1">Seat Password</p>
                                    <p className="font-mono font-black text-orange-700 text-sm break-all">{derivedPassword}</p>
                                </div>
                            </div>

                            {/* License Key */}
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">License Key</p>
                                <div className="font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 break-all">
                                    {lic.license_key}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Start</p>
                                    <p className="text-xs font-bold text-slate-800 mt-1">{new Date(lic.start_date).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Expiry</p>
                                    <p className="text-xs font-bold text-slate-800 mt-1">{new Date(lic.expiry_date).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Duration</p>
                                    <p className="text-xs font-bold text-slate-800 mt-1">{lic.duration} days</p>
                                </div>
                            </div>

                            {/* Duration progress */}
                            <div>
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Time Remaining</span>
                                    <span className={`text-[10px] font-black ${days <= 30 ? 'text-red-600' : days <= 90 ? 'text-amber-600' : 'text-green-600'}`}>
                                        {days} days left
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`h-full rounded-full transition-all ${days <= 30 ? 'bg-red-500' : days <= 90 ? 'bg-amber-500' : 'bg-green-500'}`}
                                        style={{ width: `${100 - durationPct}%` }}
                                    />
                                </div>
                            </div>

                            {/* Sessions */}
                            <div>
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Sessions</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-600">{lic.active_sessions ?? 0} / {lic.total_seats ?? 1}</span>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${lic.has_free_seat ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                            {lic.has_free_seat ? 'seat available' : 'seat full'}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`h-full rounded-full ${sessionPct >= 100 ? 'bg-red-500' : 'bg-orange-500'}`}
                                        style={{ width: `${sessionPct}%` }}
                                    />
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Created</p>
                                    <p className="font-bold text-slate-700 mt-1">{new Date(lic.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Last Updated</p>
                                    <p className="font-bold text-slate-700 mt-1">{new Date(lic.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-5">
                            <button onClick={() => setViewingLicense(null)} className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            );
        })()}
        </>
    );
}
