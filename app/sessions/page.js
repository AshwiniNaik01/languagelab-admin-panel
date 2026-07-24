'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../layouts/AdminLayout';
import { getInstitutes } from '../services/institute';
import { getInstituteLicenses, resetInstituteSeats } from '../services/superadmin';
import { RefreshCw, Zap, Users, KeyRound } from 'lucide-react';
import ScrollableTable from '../components/Table';

export default function SessionsPage() {
    const [institutes, setInstitutes] = useState([]);
    const [statsMap, setStatsMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [resetting, setResetting] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getInstitutes();
            const list = res.data?.data || res.data || [];
            const instList = Array.isArray(list) ? list : [];
            setInstitutes(instList);

            const statsResults = await Promise.allSettled(
                instList.map((inst) =>
                    getInstituteLicenses(inst._id).then((r) => ({
                        id: inst._id,
                        // ✅ fix: data.licenses holds the array, not data itself
                        licenses: r.data?.data?.licenses || r.data?.licenses || [],
                    })),
                ),
            );

            const map = {};
            statsResults.forEach((result) => {
                if (result.status === 'fulfilled') {
                    const { id, licenses } = result.value;
                    const safeList = Array.isArray(licenses) ? licenses : [];
                    const active = safeList.reduce((sum, l) => sum + (l.active_sessions || 0), 0);
                    const total = safeList.reduce((sum, l) => sum + (l.total_seats || 1), 0);
                    map[id] = { active, total, keys: safeList.length };
                }
            });
            setStatsMap(map);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to load session data', text: err?.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleResetSeats = async (inst) => {
        const result = await Swal.fire({
            title: `Reset all seats for ${inst.institute_name}?`,
            html: `This forces all <strong>${statsMap[inst._id]?.active ?? 0}</strong> currently logged-in students to re-login.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, reset all seats',
        });
        if (!result.isConfirmed) return;

        setResetting(inst._id);
        try {
            await resetInstituteSeats(inst._id);
            const r = await getInstituteLicenses(inst._id);
            const licenses = Array.isArray(r.data?.data?.licenses || r.data?.licenses)
                ? (r.data?.data?.licenses || r.data?.licenses)
                : [];
            const active = licenses.reduce((sum, l) => sum + (l.active_sessions || 0), 0);
            const total = licenses.reduce((sum, l) => sum + (l.total_seats || 1), 0);
            setStatsMap((prev) => ({ ...prev, [inst._id]: { ...prev[inst._id], active, total } }));
            Swal.fire({ icon: 'success', title: 'Seats Reset', text: 'All active sessions cleared.', timer: 2000, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Reset Failed', text: err?.response?.data?.message || err.message });
        } finally {
            setResetting(null);
        }
    };

    const totalActive = Object.values(statsMap).reduce((s, v) => s + (v.active || 0), 0);
    const totalSeats = Object.values(statsMap).reduce((s, v) => s + (v.total || 0), 0);

    const columns = [
  {
    header: "Institute",
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
            {(row.institute_name || "??").substring(0, 2).toUpperCase()}
          </div>
        )}

        <div>
          <div className="font-bold text-slate-950">
            {row.institute_name}
          </div>
          <div className="text-xs text-orange-600 font-mono font-extrabold">
            {row.institute_code}
          </div>
        </div>
      </div>
    ),
  },

  {
    header: "License Keys",
    accessor: (row) =>
      statsMap[row._id]?.keys ?? row.license_count ?? 0,
  },

  {
    header: "Active / Total",
    accessor: (row) => {
      const active = statsMap[row._id]?.active ?? 0;
      const total = statsMap[row._id]?.total ?? 0;
      const isFull = total > 0 && active >= total;

      return (
        <>
          <span
            className={`font-black text-lg ${
              isFull ? "text-red-600" : "text-slate-800"
            }`}
          >
            {active}
          </span>

          <span className="text-slate-400 font-semibold">
            {" "}
            / {total}
          </span>
        </>
      );
    },
  },

  {
    header: "Seat Usage",
    accessor: (row) => {
      const active = statsMap[row._id]?.active ?? 0;
      const total = statsMap[row._id]?.total ?? 0;

      const pct =
        total > 0
          ? Math.min(100, Math.round((active / total) * 100))
          : 0;

      const isFull = total > 0 && active >= total;

      return (
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  pct >= 90
                    ? "bg-red-500"
                    : pct >= 60
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <span className="text-xs font-bold text-slate-500 w-7 text-right">
              {pct}%
            </span>
          </div>

          {isFull && (
            <p className="text-[10px] text-red-600 font-bold">
              All seats in use
            </p>
          )}
        </div>
      );
    },
  },

  {
    header: "Emergency Reset",
    accessor: (row) => {
      const active = statsMap[row._id]?.active ?? 0;

      return (
        <button
          disabled={resetting === row._id || active === 0}
          onClick={() => handleResetSeats(row)}
          className={`px-3 py-1.5 text-xs font-black rounded-lg border transition cursor-pointer ${
            active === 0
              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          } disabled:opacity-60`}
        >
          {resetting === row._id
            ? "Resetting..."
            : "Reset All Seats"}
        </button>
      );
    },
  },
];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black text-slate-950">Live Active Sessions</h2>
                        <p className="text-xs font-semibold text-slate-500 mt-1">
                            Tracks seat usage per institute in real-time. Cron job frees expired seats every 5 minutes.
                        </p>
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-orange-500/20 p-5 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Total Institutes</p>
                            <p className="text-3xl font-black text-[#3C1E0A]">{institutes.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-orange-500/20 p-5 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Active Sessions Now</p>
                            <p className="text-3xl font-black text-orange-600">{totalActive}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-orange-500/20 p-5 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                            <KeyRound size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black">Total Licensed Seats</p>
                            <p className="text-3xl font-black text-slate-700">{totalSeats}</p>
                        </div>
                    </div>
                </div>

                <ScrollableTable
  columns={columns}
  data={institutes}
  loading={loading}
  emptyMessage="No institutes found."
/>



                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
                    ⚠ <strong>Reset All Seats</strong> immediately sets all active_sessions to 0 — all logged-in students will be kicked out and must re-login. Use only in emergencies. The cron job frees seats from expired sessions every 5 minutes.
                </div>
            </div>
        </AdminLayout>
    );
}
