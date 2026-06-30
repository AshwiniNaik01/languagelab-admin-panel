'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import EditorLayout from '../../layouts/EditorLayout';
import CourseForm from '../../components/form/CourseForm';
import { ActionButton } from '../../components/ui/ActionIconButton';
import Button from '../../components/ui/Button';
import { getEditorCourses, createEditorCourse, updateEditorCourse, getTopics } from '../../services/editorPanel';
import { Check } from 'lucide-react';

export default function EditorCoursesPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('manage');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    // Topics modal
    const [allTopics, setAllTopics] = useState([]);
    const [assigningCourse, setAssigningCourse] = useState(null);
    const [selectedTopicIds, setSelectedTopicIds] = useState([]);
    const [savingTopics, setSavingTopics] = useState(false);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const res = await getEditorCourses();
            const list = res.data?.data || res.data || [];
            setCourses(Array.isArray(list) ? list.filter((c) => c && c._id) : []);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to load courses', text: err?.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    const loadTopics = async () => {
        try {
            const res = await getTopics();
            const list = res.data?.data || res.data || [];
            setAllTopics(Array.isArray(list) ? list : []);
        } catch { /* non-blocking */ }
    };

    useEffect(() => {
        const init = async () => { await loadCourses(); await loadTopics(); };
        init();
    }, []);

    const openTopicsModal = (course) => {
        const current = (course.topic_ids || []).map((t) => (typeof t === 'object' ? t._id : t));
        setSelectedTopicIds(current);
        setAssigningCourse(course);
    };

    const toggleTopic = (id) => {
        setSelectedTopicIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    };

    const handleSaveTopics = async () => {
        setSavingTopics(true);
        try {
            await updateEditorCourse(assigningCourse._id, { topic_ids: selectedTopicIds });
            setCourses((prev) => prev.map((c) => c._id === assigningCourse._id ? { ...c, topic_ids: selectedTopicIds } : c));
            setAssigningCourse(null);
            Swal.fire({ icon: 'success', title: 'Topics Assigned', timer: 1200, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed', text: err?.response?.data?.message || err.message });
        } finally {
            setSavingTopics(false);
        }
    };

    const handleCreateSubmit = async (data) => {
        try {
            await createEditorCourse(data);
            await loadCourses();
            setActiveTab('manage');
            Swal.fire({ icon: 'success', title: 'Course Created', timer: 1500, showConfirmButton: false });
        } catch (err) {
            const is409 = err?.response?.status === 409;
            Swal.fire({
                icon: 'error',
                title: is409 ? 'Course Code Already Exists' : 'Creation Failed',
                text: is409 ? 'A course with this code already exists. Use a different course code.' : err?.response?.data?.message || err.message,
            });
        }
    };

    const handleEditSubmit = async (data) => {
        await updateEditorCourse(editingCourse._id, data);
        setCourses((prev) => prev.map((c) => (c._id === editingCourse._id ? { ...c, ...data } : c)));
        setEditingCourse(null);
        setActiveTab('manage');
        Swal.fire({ icon: 'success', title: 'Course Updated', timer: 1500, showConfirmButton: false });
    };

    const handleStatusToggle = async (course) => {
        try {
            await updateEditorCourse(course._id, { is_active: !course.is_active });
            setCourses((prev) => prev.map((c) => (c._id === course._id ? { ...c, is_active: !c.is_active } : c)));
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Toggle Failed', text: err?.response?.data?.message || err.message });
        }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: `Deactivate "${name}"?`,
            text: 'The course will be set to inactive and removed from the list.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            confirmButtonText: 'Yes, deactivate',
        });
        if (!result.isConfirmed) return;
        try {
            await updateEditorCourse(id, { is_active: false });
            setCourses((prev) => prev.filter((c) => c._id !== id));
            Swal.fire({ icon: 'success', title: 'Course Deactivated', timer: 1200, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed', text: err?.response?.data?.message || err.message });
        }
    };

    const levelBadge = (level) => {
        const map = { beginner: 'bg-green-50 text-green-700 border-green-300', intermediate: 'bg-amber-50 text-amber-700 border-amber-300', advanced: 'bg-red-50 text-red-700 border-red-300' };
        return map[level] || 'bg-slate-100 text-slate-600 border-slate-300';
    };

    if (activeTab === 'create') return (
        <EditorLayout>
            <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
                <CourseForm onSuccess={handleCreateSubmit} onCancel={() => setActiveTab('manage')} />
            </div>
        </EditorLayout>
    );

    if (activeTab === 'edit' && editingCourse) return (
        <EditorLayout>
            <div className="bg-[#FFF8F4] p-0.5 rounded-3xl w-full">
                <CourseForm initialData={editingCourse} onSuccess={handleEditSubmit} onCancel={() => { setActiveTab('manage'); setEditingCourse(null); }} />
            </div>
        </EditorLayout>
    );

    return (
        <EditorLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-950">Courses</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                        Create and manage course templates. Assign topics to courses here.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 border-r-2" />
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-sm font-semibold">No courses found.</div>
                ) : (
                    <div className="w-full bg-white rounded-2xl border border-orange-200 shadow-md overflow-hidden">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-linear-to-r from-orange-500 to-amber-600 px-6 py-4">
                            {['Course', 'Level', 'Language', 'Duration', 'Topics', 'Status', 'Actions'].map((h) => (
                                <span key={h} className="text-xs font-black uppercase tracking-wider text-white">{h}</span>
                            ))}
                        </div>

                        {courses.map((course, idx) => {
                            const topicCount = course.topic_ids?.length || 0;
                            return (
                                <div key={course._id} className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-6 py-4 items-center border-b border-orange-100 hover:bg-orange-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FFF8F4]/30'}`}>
                                    <button
                                        onClick={() => router.push(`/editor/courses/${course._id}`)}
                                        className="text-left hover:opacity-80 transition-opacity cursor-pointer"
                                    >
                                        <div className="font-bold text-slate-950 text-sm hover:text-orange-600 transition-colors">{course.course_name}</div>
                                        <div className="text-xs text-orange-600 font-mono font-extrabold">{course.course_code}</div>
                                    </button>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold capitalize w-fit ${levelBadge(course.level)}`}>
                                        {course.level || '—'}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700">{course.language || '—'}</span>
                                    <span className="font-extrabold text-slate-950 text-sm">{course.duration_days ? `${course.duration_days}d` : '—'}</span>
                                    <button
                                        onClick={() => openTopicsModal(course)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold transition-all w-fit cursor-pointer bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                                    >
                                        {topicCount} topic{topicCount !== 1 ? 's' : ''}
                                    </button>
                                    <span
                                        onClick={() => handleStatusToggle(course)}
                                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full cursor-pointer select-none transition-all w-fit ${
                                            course.is_active ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100' : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${course.is_active ? 'bg-green-500' : 'bg-slate-400'}`} />
                                        {course.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <ActionButton
                                        onEdit={() => { setEditingCourse(course); setActiveTab('edit'); }}
                                        onDelete={() => handleDelete(course._id, course.course_name)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── ASSIGN TOPICS MODAL ─────────────────────────────────── */}
                {assigningCourse && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold mb-1">Assign Topics</h3>
                            <p className="text-sm mb-5 text-orange-600 font-semibold">{assigningCourse.course_name}</p>
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {allTopics.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4 italic">No topics yet. Create topics first.</p>
                                ) : allTopics.map((t) => {
                                    const checked = selectedTopicIds.includes(t._id);
                                    return (
                                        <label
                                            key={t._id}
                                            onClick={() => toggleTopic(t._id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${checked ? 'bg-orange-50 border-orange-400' : 'bg-white border-slate-200 hover:border-orange-200'}`}
                                        >
                                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                                                {checked && <Check size={10} strokeWidth={3} className="text-white" />}
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{t.title}</p>
                                                {t.order != null && <p className="text-[10px] text-orange-600 font-bold">Order #{t.order}</p>}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between items-center mt-5 pt-4 border-t border-orange-500/10">
                                <span className="text-xs text-slate-500 font-semibold">{selectedTopicIds.length} selected</span>
                                <div className="flex gap-3">
                                    <Button variant="secondary" onClick={() => setAssigningCourse(null)}>Cancel</Button>
                                    <Button onClick={handleSaveTopics} disabled={savingTopics}>
                                        {savingTopics ? 'Saving…' : 'Save Topics'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </EditorLayout>
    );
}
