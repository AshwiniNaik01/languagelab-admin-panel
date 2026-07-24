'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../layouts/AdminLayout';
import ScrollableTable from '../components/Table';
import Button from '../components/ui/Button';
import StudentForm from '../components/form/StudentForm';
import { getStudents, createStudent, toggleStudentStatus, deleteStudent } from '../services/student';
import { getInstitutes } from '../services/institute';

export default function StudentsPage() {
    const [activeTab, setActiveTab] = useState('manage');
    const [students, setStudents] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createdStudent, setCreatedStudent] = useState(null); // show generated_password once

    useEffect(() => {
        loadStudents();
        loadInstitutes();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const res = await getStudents();
            const list = res.data?.data || res.data || [];
            setStudents(Array.isArray(list) ? list : []);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to load students',
                text: err?.response?.data?.message || err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const loadInstitutes = async () => {
        try {
            const res = await getInstitutes();
            const list = res.data?.data || res.data || [];
            setInstitutes(Array.isArray(list) ? list : []);
        } catch {
            // non-blocking — dropdown will just be empty
        }
    };

    const handleCreateSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await createStudent(data);
            const created = res.data?.data || res.data;
            setActiveTab('manage');
            loadStudents();
            // Show generated password once — must save it
            if (created?.generated_password) {
                setCreatedStudent(created);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Student Registered',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err?.response?.data?.message || err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleStudentStatus(id);
            setStudents((prev) =>
                prev.map((s) =>
                    s._id === id
                        ? { ...s, is_active: !s.is_active, status: !s.is_active ? 'active' : 'inactive' }
                        : s,
                ),
            );
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Toggle Failed',
                text: err?.response?.data?.message || err.message,
            });
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
            await deleteStudent(id);
            setStudents((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: err?.response?.data?.message || err.message,
            });
        }
    };

    const getInstituteName = (id) => {
        const match = institutes.find((c) => c._id === id);
        return match ? match.institute_name : id || '—';
    };

    const columns = [
        {
            header: 'Student',
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-700 text-xs">
                        {(row.full_name || '??').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-slate-950">{row.full_name}</div>
                        <div className="text-xs text-orange-600 font-bold">{row.roll_no}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Enrollment / Email',
            accessor: (row) => (
                <div className="text-xs">
                    <div className="font-mono font-bold text-slate-700">{row.enrollment_no || '—'}</div>
                    <div className="text-slate-500">{row.email || '—'}</div>
                </div>
            ),
        },
        {
            header: 'Institute',
            accessor: (row) => (
                <span className="text-xs font-semibold text-slate-700">
                    {getInstituteName(row.institute_id)}
                </span>
            ),
        },
        {
            header: 'Stream / Year',
            accessor: (row) => (
                <div className="text-xs">
                    <div className="font-semibold text-slate-950">{row.course || 'General'}</div>
                    <div className="text-slate-500">Year {row.year || 1} · {row.batch || '—'}</div>
                </div>
            ),
        },
        {
            header: 'Status',
            accessor: (row) => (
                <span
                    onClick={() => handleToggleStatus(row._id)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-full cursor-pointer select-none ${
                        row.is_active
                            ? 'bg-orange-50 text-orange-700 border border-orange-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: (row) => (
                <Button size="sm" variant="danger" onClick={() => handleDelete(row._id, row.full_name)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {activeTab === 'manage' && (
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-950">Students</h2>
                            <p className="text-xs font-semibold text-slate-500">
                                View and manage enrolled students across all institutes.
                            </p>
                        </div>
                        <Button onClick={() => setActiveTab('create')}>+ Register Student</Button>
                    </div>
                )}

                {activeTab === 'create' ? (
                    <div className="bg-[#FFF8F4] p-0.5 rounded-3xl">
                        <StudentForm
                            institutes={institutes}
                            onSubmit={handleCreateSubmit}
                            onCancel={() => setActiveTab('manage')}
                        />
                    </div>
                ) : (
                    <ScrollableTable columns={columns} data={students} loading={loading} />
                )}
            </div>

            {/* Generated password shown ONCE */}
            {createdStudent && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-black text-green-700 mb-1">Student Registered ✓</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            <strong>{createdStudent.full_name}</strong> · {createdStudent.enrollment_no}
                        </p>
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold mb-4">
                            ⚠ Password shown ONCE — save it now.
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 mb-4">
                            <p className="text-xs text-slate-500 font-semibold mb-1">Generated Password</p>
                            <p className="font-mono font-black text-orange-700 text-lg">
                                {createdStudent.generated_password}
                            </p>
                        </div>
                        <Button className="w-full" onClick={() => setCreatedStudent(null)}>
                            I have saved the password — Close
                        </Button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
