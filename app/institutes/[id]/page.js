"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";
import Button from "../../components/ui/Button";
import Breadcrumb from "../../components/ui/Breadcrumb";
import {
  getInstituteById,
  toggleInstituteStatus,
  generateLicense,
} from "../../services/institute";
import {
  getInstituteLicenses,
  suspendLicense,
  activateLicense,
  expireLicense,
  renewLicense,
} from "../../services/superadmin";
import { KeyRound, ArrowLeft, RotateCcw } from "lucide-react";

const licenseStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700 border-green-300";
    case "suspended":
      return "bg-amber-50 text-amber-700 border-amber-300";
    case "expired":
      return "bg-red-50 text-red-700 border-red-300";
    default:
      return "bg-slate-100 text-slate-700 border-slate-300";
  }
};

const daysLeft = (expiry) => {
  const d = Math.ceil((new Date(expiry) - new Date()) / 86400000);
  return d > 0 ? d : 0;
};

export default function InstituteViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  const [licenses, setLicenses] = useState([]);
  const [licensesLoading, setLicensesLoading] = useState(true);
  const [licenseActionLoading, setLicenseActionLoading] = useState(null);

  // Renewal modal
  const [renewingLicense, setRenewingLicense] = useState(null);
  const [renewStartDate, setRenewStartDate] = useState("");
  const [renewEndDate, setRenewEndDate] = useState("");
  const [renewLoading, setRenewLoading] = useState(false);

  // Generate license modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [licenseCount, setLicenseCount] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [generatedLicenses, setGeneratedLicenses] = useState(null);

  const loadInstitute = async () => {
    setLoading(true);
    try {
      const res = await getInstituteById(id);
      setInstitute(res.data?.data || res.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load institute",
        text: err?.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLicenses = async () => {
    setLicensesLoading(true);
    try {
      const res = await getInstituteLicenses(id);
      const list =
        res.data?.data?.licenses || res.data?.licenses || res.data || [];
      setLicenses(Array.isArray(list) ? list : []);
    } catch {
      setLicenses([]);
    } finally {
      setLicensesLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadInstitute(); loadLicenses(); }, [id]);

  const handleToggleActive = async () => {
    try {
      await toggleInstituteStatus(id);
      setInstitute((prev) => ({ ...prev, is_active: !prev.is_active }));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Toggle Failed",
        text: err?.response?.data?.message || err.message,
      });
    }
  };

  const handleLicenseAction = async (licenseId, action) => {
    const actionMap = {
      suspend: { fn: suspendLicense, label: "Suspend", color: "#d33" },
      activate: { fn: activateLicense, label: "Activate", color: "#15803d" },
      expire: { fn: expireLicense, label: "Expire", color: "#d33" },
    };
    const { fn, label, color } = actionMap[action];
    const result = await Swal.fire({
      title: `${label} this license?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${label.toLowerCase()} it`,
      confirmButtonColor: color,
    });
    if (!result.isConfirmed) return;
    setLicenseActionLoading(licenseId);
    try {
      await fn(licenseId);
      await loadLicenses();
      Swal.fire({
        icon: "success",
        title: `License ${label}d`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: `${label} Failed`,
        text: err?.response?.data?.message || err.message,
      });
    } finally {
      setLicenseActionLoading(null);
    }
  };

  const openRenewModal = (lic) => {
    setRenewingLicense(lic);
    setRenewStartDate("");
    setRenewEndDate("");
  };

  const handleRenewLicense = async () => {
    if (!renewStartDate || !renewEndDate) {
      Swal.fire({
        icon: "warning",
        title: "Select both start and expiry dates",
      });
      return;
    }
    setRenewLoading(true);
    try {
      await renewLicense(renewingLicense._id, {
        start_date: renewStartDate,
        expiry_date: renewEndDate,
      });
      setRenewingLicense(null);
      await loadLicenses();
      Swal.fire({
        icon: "success",
        title: "License Renewed",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Renewal Failed",
        text: err?.response?.data?.message || err.message,
      });
    } finally {
      setRenewLoading(false);
    }
  };

  const handleGenerateLicense = async () => {
    if (!licenseCount || licenseCount < 1) {
      Swal.fire({ icon: "warning", title: "Enter at least 1 license" });
      return;
    }
    if (!startDate || !endDate) {
      Swal.fire({ icon: "warning", title: "Select start and expiry dates" });
      return;
    }
    setLicenseLoading(true);
    try {
      const res = await generateLicense(id, {
        license_count: licenseCount,
        start_date: startDate,
        expiry_date: endDate,
      });
      setShowGenerateModal(false);
      const payload = res.data?.data || res.data;
      setGeneratedLicenses(payload);
      await loadInstitute();
      await loadLicenses();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "License Generation Failed",
        text: err?.response?.data?.message || err.message,
      });
    } finally {
      setLicenseLoading(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
        </div>
      </AdminLayout>
    );
  }

  if (!institute) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-slate-400 font-semibold">
          Institute not found.
          <br />
          <button
            onClick={() => router.push("/institutes")}
            className="mt-4 text-orange-500 font-bold hover:underline"
          >
            ← Back to Institutes
          </button>
        </div>
      </AdminLayout>
    );
  }

  const activeLicenses = licenses.filter((l) => l.status === "active").length;
  const suspendedLicenses = licenses.filter(
    (l) => l.status === "suspended",
  ).length;
  const expiredLicenses = licenses.filter((l) => l.status === "expired").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Institutes", href: "/institutes" },
            { label: institute.institute_name },
          ]}
        />

        {/* Page header */}
        <div className="flex items-center gap-5">
            <button
              onClick={() => router.push("/institutes")}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors shrink-0"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>

            {institute.logo ? (
              <img
                src={institute.logo}
                alt={institute.institute_name}
                className="w-16 h-16 object-cover rounded-2xl border border-orange-200 bg-white shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center font-black text-orange-700 text-xl shrink-0">
                {institute.institute_name.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {institute.institute_name}
              </h2>
              <p className="text-sm text-orange-600 font-mono font-extrabold">
                {institute.institute_code}
              </p>
            </div>
        </div>

        {/* Institute detail cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Info */}
          <div className="lg:col-span-2 bg-white border border-orange-500/20 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black mb-4">
              Institute Details
            </p>
            <div className="grid grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
                  Email
                </p>
                <p className="font-bold text-slate-800">{institute.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
                  Phone
                </p>
                <p className="font-bold text-slate-800">
                  {institute.phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
                  Website
                </p>
                {institute.website ? (
                  <a
                    href={institute.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-orange-600 hover:underline break-all"
                  >
                    {institute.website}
                  </a>
                ) : (
                  <p className="font-bold text-slate-800">—</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
                  Max Students
                </p>
                <p className="font-bold text-slate-800">
                  {institute.max_students}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2">
                  Address
                </p>
                {institute.address && typeof institute.address === "object" ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {[
                      ["Line 1", institute.address.line1],
                      ["Line 2", institute.address.line2],
                      ["Pincode", institute.address.pincode],
                      ["State", institute.address.state],
                      ["District", institute.address.dist],
                      ["Taluka", institute.address.taluka],
                      ["Authorized Name", institute.address.autorizedName],
                      ["Authorized Phone", institute.address.autorizedPhono],
                    ]
                      .filter(([, val]) => val)
                      .map(([label, val]) => (
                        <div key={label}>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{label}: </span>
                          <span className="font-bold text-slate-800">{val}</span>
                        </div>
                      ))}
                    {institute.address.nearbyLandmarks && (
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Landmarks: </span>
                        <span className="font-bold text-slate-800">{institute.address.nearbyLandmarks}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-bold text-slate-400">—</p>
                )}
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
                  Status
                </p>
                <span
                  onClick={handleToggleActive}
                  className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full cursor-pointer select-none transition-all ${
                    institute.is_active
                      ? "bg-green-50 text-green-700 border border-green-300 hover:bg-green-100"
                      : "bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${institute.is_active ? "bg-green-500" : "bg-slate-400"}`}
                  />
                  {institute.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* License stats */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <KeyRound
                  size={20}
                  className="text-orange-600"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  Total Keys
                </p>
                <p className="text-2xl font-black text-slate-950">
                  {institute.license_count || 0}
                </p>
              </div>
            </div>
            <div className="bg-white border border-green-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  Active
                </p>
                <p className="text-2xl font-black text-green-700">
                  {activeLicenses}
                </p>
              </div>
            </div>
            <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  Suspended
                </p>
                <p className="text-2xl font-black text-amber-700">
                  {suspendedLicenses}
                </p>
              </div>
            </div>
            <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <span className="w-3 h-3 rounded-full bg-red-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  Expired
                </p>
                <p className="text-2xl font-black text-red-700">
                  {expiredLicenses}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Courses */}
        <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-orange-500/10 flex items-center justify-between">
            <p className="font-black text-slate-950">Assigned Courses</p>
            <span className="text-xs font-bold text-orange-600">
              {institute.courses?.length || 0} course{institute.courses?.length !== 1 ? 's' : ''}
            </span>
          </div>

          {!institute.courses?.length ? (
            <div className="text-center py-10 text-slate-400 text-sm font-semibold">
              No courses assigned to this institute.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {institute.courses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-orange-500/10 bg-orange-50/30 hover:bg-orange-50/60 transition-colors"
                >
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.course_name}
                      className="w-12 h-12 object-cover rounded-xl border border-orange-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 font-black text-orange-600 text-lg">
                      {(course.course_name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{course.course_name}</p>
                    <span className={`inline-flex items-center mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                      course.level === 'beginner' ? 'bg-green-50 text-green-700 border border-green-200' :
                      course.level === 'intermediate' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {course.level || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Licenses table */}
        <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-orange-500/10 flex items-center justify-between">
            <p className="font-black text-slate-950">License Keys</p>
            <span className="text-xs font-bold text-orange-600">
              {licenses.length} keys
            </span>
          </div>

          {licensesLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 border-r-2" />
            </div>
          )}

          {!licensesLoading && licenses.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">
              No license keys generated yet.
              <br />
              <button
                onClick={() => setShowGenerateModal(true)}
                className="mt-3 text-orange-500 font-bold hover:underline text-sm"
              >
                Generate keys →
              </button>
            </div>
          )}

          {!licensesLoading && licenses.length > 0 && (
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_1fr] gap-4 text-[10px] font-black text-slate-500 uppercase tracking-wider px-6 py-3 bg-orange-50/60 border-b border-orange-500/10">
                <span>#</span>
                <span>License Code</span>
                <span>Sessions</span>
                <span>Expiry</span>
                <span>Days Left</span>
                <span>Actions</span>
              </div>

              {licenses.map((lic) => {
                const days = daysLeft(lic.expiry_date);
                const sessionPct = Math.min(
                  100,
                  ((lic.active_sessions ?? 0) / (lic.total_seats || 1)) * 100,
                );
                return (
                  <div
                    key={lic._id}
                    className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-orange-50/20 transition-colors items-center text-sm"
                  >
                    {/* Index */}
                    <div className="font-black text-slate-400 text-xs">
                      {lic.key_index}
                    </div>

                    {/* Code + status */}
                    <div>
                      <span className="font-mono font-black text-orange-700 text-xs block">
                        {lic.license_code}
                      </span>
                      <span
                        className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${licenseStatusColor(lic.status)}`}
                      >
                        {lic.status}
                      </span>
                    </div>

                    {/* Sessions */}
                    <div>
                      <span className="font-bold text-slate-700 text-xs">
                        {lic.active_sessions ?? 0} / {lic.total_seats ?? 1}
                      </span>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
                        <div
                          className={`h-full rounded-full ${sessionPct >= 100 ? "bg-red-500" : "bg-orange-500"}`}
                          style={{ width: `${sessionPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="font-semibold text-slate-700 text-xs">
                      {lic.expiry_date
                        ? new Date(lic.expiry_date).toLocaleDateString()
                        : "—"}
                    </div>

                    {/* Days left */}
                    <div
                      className={`font-black text-xs ${days <= 30 ? "text-red-600" : days <= 90 ? "text-amber-600" : "text-green-600"}`}
                    >
                      {days} days
                    </div>

                    {/* Actions — all inline */}
                    <div className="flex items-center gap-1 flex-nowrap">
                      {lic.status === "active" && (
                        <button
                          disabled={licenseActionLoading === lic._id}
                          onClick={() =>
                            handleLicenseAction(lic._id, "suspend")
                          }
                          className="px-2 py-1 text-[10px] font-black rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-50 whitespace-nowrap"
                        >
                          Suspend
                        </button>
                      )}
                      {lic.status === "suspended" && (
                        <button
                          disabled={licenseActionLoading === lic._id}
                          onClick={() =>
                            handleLicenseAction(lic._id, "activate")
                          }
                          className="px-2 py-1 text-[10px] font-black rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50 whitespace-nowrap"
                        >
                          Activate
                        </button>
                      )}
                      {lic.status !== "expired" && (
                        <button
                          disabled={licenseActionLoading === lic._id}
                          onClick={() => handleLicenseAction(lic._id, "expire")}
                          className="px-2 py-1 text-[10px] font-black rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 whitespace-nowrap"
                        >
                          Expire
                        </button>
                      )}
                      <button
                        onClick={() => openRenewModal(lic)}
                        title="Renew license"
                        className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-black rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all whitespace-nowrap"
                      >
                        <RotateCcw size={10} strokeWidth={2.5} />
                        Renew
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── RENEWAL MODAL ──────────────────────────────────────────────────── */}
      {renewingLicense && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                <RotateCcw
                  size={16}
                  className="text-sky-600"
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-lg font-black text-slate-950">
                Renew License
              </h3>
            </div>
            <p className="text-xs text-sky-700 font-mono font-bold mb-5 ml-12">
              {renewingLicense.license_code}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  New Start Date
                </label>
                <input
                  type="date"
                  value={renewStartDate}
                  onChange={(e) => setRenewStartDate(e.target.value)}
                  className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  New Expiry Date
                </label>
                <input
                  type="date"
                  value={renewEndDate}
                  onChange={(e) => setRenewEndDate(e.target.value)}
                  className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
            </div>

            {renewingLicense.status === "expired" && (
              <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 font-semibold">
                This license is expired. Renewing will reactivate it with the
                new dates.
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setRenewingLicense(null)}
              >
                Cancel
              </Button>
              <button
                onClick={handleRenewLicense}
                disabled={renewLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={14} strokeWidth={2.5} />
                {renewLoading ? "Renewing…" : "Confirm Renewal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GENERATE LICENSE MODAL ─────────────────────────────────────────── */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-1">Generate License Keys</h3>
            <p className="text-sm mb-5 text-orange-600 font-semibold">
              {institute.institute_name}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Number of License Keys
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl border border-orange-200 font-bold text-lg hover:bg-orange-50 transition"
                    onClick={() => setLicenseCount((v) => Math.max(1, v - 1))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={licenseCount}
                    onChange={(e) => setLicenseCount(Number(e.target.value))}
                    className="flex-1 border border-orange-200 rounded-xl px-3 py-2 text-center font-bold"
                  />
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 transition"
                    onClick={() => setLicenseCount((v) => v + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Each key = 1 concurrent seat. {licenseCount} key
                  {licenseCount > 1 ? "s" : ""} = {licenseCount} seat
                  {licenseCount > 1 ? "s" : ""}.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
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
                  className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
              ⚠ Passwords are shown ONCE after generation. Save them
              immediately.
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowGenerateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleGenerateLicense} disabled={licenseLoading}>
                {licenseLoading ? "Generating…" : "Generate Keys"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── LICENSE RESULT MODAL (shown ONCE) ──────────────────────────────── */}
      {generatedLicenses && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xl font-black text-green-700">
                License Keys Generated ✓
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Institute: <strong>{generatedLicenses.institute_code}</strong>{" "}
                &nbsp;·&nbsp;
                {generatedLicenses.license_count} key
                {generatedLicenses.license_count > 1 ? "s" : ""}
              </p>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 font-bold">
              ⚠ CRITICAL — Passwords shown ONCE only. Copy and save now. Cannot
              be retrieved again.
            </div>

            <div className="space-y-2 mb-6">
              <div className="grid grid-cols-5 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-wider px-2">
                <span>#</span>
                <span>License Code</span>
                <span>User ID</span>
                <span>Password</span>
                <span>Status</span>
              </div>
              {generatedLicenses.licenses?.map((lic) => (
                <div
                  key={lic.key_index}
                  className="grid grid-cols-5 gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 text-xs items-center"
                >
                  <span className="font-black text-green-700">
                    {lic.key_index}
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {lic.license_code}
                  </span>
                  <span className="font-mono font-bold text-purple-700">
                    {lic.user_id}
                  </span>
                  <span className="font-mono font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg">
                    {lic.password}
                  </span>
                  <span className="text-green-700 font-bold capitalize">
                    {lic.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <p className="text-xs font-bold text-slate-600 mb-1">
                Full License Keys (for records)
              </p>
              {generatedLicenses.licenses?.map((lic) => (
                <div
                  key={lic.key_index}
                  className="text-[11px] font-mono text-slate-500 truncate"
                >
                  {lic.license_code}: {lic.license_key}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setGeneratedLicenses(null)}>
                I have saved the passwords — Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
