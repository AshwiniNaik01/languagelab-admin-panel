'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../layouts/AdminLayout';
import Button from '../components/ui/Button';
import LogoFileUploader from '../components/form/LogoFileUploader';
import { getProfile, updateProfile, changePassword } from '../services/superadmin';
import { User, Phone, Mail, ShieldCheck, Clock, Lock, Eye, EyeOff } from 'lucide-react';

function FormInput({ label, icon: Icon, required, type = 'text', showToggle = false, ...props }) {
    const [show, setShow] = useState(false);
    const inputType = showToggle && type === 'password' ? (show ? 'text' : 'password') : type;

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
                        <Icon size={16} strokeWidth={2} />
                    </span>
                )}
                <input
                    {...props}
                    type={inputType}
                    autoComplete="new-password"
                    className={`w-full ${Icon ? 'pl-10' : 'px-4'} ${showToggle ? 'pr-10' : 'pr-4'} py-3 rounded-xl border border-orange-300 bg-white text-gray-700 placeholder:text-gray-400 outline-none transition-all text-sm hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                />
                {showToggle && type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition"
                    >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const [form, setForm] = useState({ full_name: '', phone: '' });
    const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await getProfile();
            const data = res.data?.data || res.data;
            setProfile(data);
            setForm({ full_name: data.full_name || '', phone: data.phone || '' });
            setProfileImage(data.profileImage || '');
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to load profile', text: err?.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProfile(); }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!form.full_name.trim()) { Swal.fire({ icon: 'warning', title: 'Full name is required' }); return; }
        setSaving(true);
        try {
            await updateProfile({ full_name: form.full_name, phone: form.phone, profileImage });
            setProfile((prev) => ({ ...prev, ...form, profileImage }));
            Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Update Failed', text: err?.response?.data?.message || err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!pwForm.current_password || !pwForm.new_password) { Swal.fire({ icon: 'warning', title: 'All password fields are required' }); return; }
        if (pwForm.new_password !== pwForm.confirm_password) { Swal.fire({ icon: 'warning', title: 'New passwords do not match' }); return; }
        if (pwForm.new_password.length < 6) { Swal.fire({ icon: 'warning', title: 'Password must be at least 6 characters' }); return; }
        setSaving(true);
        try {
            await changePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password });
            setPwForm({ current_password: '', new_password: '', confirm_password: '' });
            Swal.fire({ icon: 'success', title: 'Password Changed', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Password Change Failed', text: err?.response?.data?.message || err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-black text-slate-950">SuperAdmin Profile</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                        Manage your account details and security settings.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Left: Profile Card ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl border border-orange-500/20 shadow-sm overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-orange-500 to-amber-500" />
                            <div className="px-6 pb-6 -mt-10">
                                <div className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white mb-4 overflow-hidden">
                                    {profile?.profileImage ? (
                                        <img
                                            src={profile.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center">
                                            <span className="text-white font-black text-2xl">
                                                {(profile?.full_name || 'SA').substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4 mt-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><User size={14} /></span>
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Full Name</p>
                                            <p className="font-bold text-[#3C1E0A] text-sm">{profile?.full_name || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><Mail size={14} /></span>
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Email</p>
                                            <p className="font-bold text-[#3C1E0A] text-sm break-all">{profile?.email || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><Phone size={14} /></span>
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Phone</p>
                                            <p className="font-bold text-[#3C1E0A] text-sm">{profile?.phone || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><ShieldCheck size={14} /></span>
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Role</p>
                                            <span className="inline-block mt-0.5 px-2.5 py-0.5 text-xs font-black rounded-full bg-orange-100 text-orange-700 border border-orange-300">
                                                {profile?.role || 'super_admin'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><Clock size={14} /></span>
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Last Login</p>
                                            <p className="font-bold text-[#3C1E0A] text-xs">
                                                {profile?.last_login ? new Date(profile.last_login).toLocaleString() : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Forms ── */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Edit Profile */}
                        <div className="bg-white rounded-3xl border border-orange-500/20 shadow-sm p-8">
                            <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4 mb-6">
                                Edit Profile
                            </h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormInput
                                        label="Full Name"
                                        icon={User}
                                        required
                                        type="text"
                                        placeholder="Your full name"
                                        value={form.full_name}
                                        onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                                    />
                                    <FormInput
                                        label="Phone"
                                        icon={Phone}
                                        type="text"
                                        placeholder="10-digit number"
                                        value={form.phone}
                                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                    />
                                </div>
                                <LogoFileUploader
                                    label="Profile Image"
                                    uploadedText="Profile image uploaded"
                                    previewAlt="Profile image preview"
                                    onFileUploaded={setProfileImage}
                                    initialLogoUrl={profile?.profileImage}
                                />
                                <div className="flex justify-end pt-2 border-t border-orange-500/10">
                                    <Button type="submit" disabled={saving}>
                                        {saving ? 'Saving…' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Change Password */}
                        <div className="bg-white rounded-3xl border border-orange-500/20 shadow-sm p-8">
                            <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4 mb-6">
                                Change Password
                            </h3>
                            <form onSubmit={handleChangePassword} className="space-y-5">
                                <FormInput
                                    label="Current Password"
                                    icon={Lock}
                                    required
                                    type="password"
                                    showToggle
                                    placeholder="••••••••"
                                    value={pwForm.current_password}
                                    onChange={(e) => setPwForm((p) => ({ ...p, current_password: e.target.value }))}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormInput
                                        label="New Password"
                                        icon={Lock}
                                        required
                                        type="password"
                                        showToggle
                                        placeholder="••••••••"
                                        value={pwForm.new_password}
                                        onChange={(e) => setPwForm((p) => ({ ...p, new_password: e.target.value }))}
                                    />
                                    <FormInput
                                        label="Confirm New Password"
                                        icon={Lock}
                                        required
                                        type="password"
                                        showToggle
                                        placeholder="••••••••"
                                        value={pwForm.confirm_password}
                                        onChange={(e) => setPwForm((p) => ({ ...p, confirm_password: e.target.value }))}
                                    />
                                </div>
                                <div className="flex justify-end pt-2 border-t border-orange-500/10">
                                    <Button type="submit" disabled={saving}>
                                        {saving ? 'Changing…' : 'Change Password'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
