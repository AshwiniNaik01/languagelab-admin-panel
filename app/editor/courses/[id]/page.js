'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import EditorLayout from '../../../layouts/EditorLayout';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import { getEditorCourse } from '../../../services/editorPanel';
import { ArrowLeft, BookOpen, Globe, Clock, Tag, BarChart2 } from 'lucide-react';

const levelBadge = (level) => {
    const map = {
        beginner: 'bg-green-50 text-green-700 border-green-300',
        intermediate: 'bg-amber-50 text-amber-700 border-amber-300',
        advanced: 'bg-red-50 text-red-700 border-red-300',
    };
    return map[level] || 'bg-slate-100 text-slate-600 border-slate-300';
};

export default function EditorCourseViewPage() {
    const { id } = useParams();
    const router = useRouter();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getEditorCourse(id)
            .then((res) => setCourse(res.data?.data || res.data))
            .catch((err) => Swal.fire({ icon: 'error', title: 'Failed to load course', text: err?.response?.data?.message || err.message }))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <EditorLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
                </div>
            </EditorLayout>
        );
    }

    if (!course) {
        return (
            <EditorLayout>
                <div className="text-center py-20 text-slate-400 font-semibold">
                    Course not found.
                    <br />
                    <button onClick={() => router.push('/editor/courses')} className="mt-4 text-orange-500 font-bold hover:underline">
                        ← Back to Courses
                    </button>
                </div>
            </EditorLayout>
        );
    }

    const topics = course.topic_ids || [];

    return (
        <EditorLayout>
            <div className="space-y-6">
                <Breadcrumb items={[
                    { label: 'Courses', href: '/editor/courses' },
                    { label: course.course_name },
                ]} />

                {/* Header card */}
                <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
                    <div className="h-2 bg-linear-to-r from-orange-500 to-amber-400" />
                    <div className="p-6 flex items-center gap-5">
                        <button
                            onClick={() => router.push('/editor/courses')}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors shrink-0 self-start mt-0.5"
                        >
                            <ArrowLeft size={16} strokeWidth={2.5} />
                        </button>

                        {course.thumbnail_url ? (
                            <img
                                src={course.thumbnail_url}
                                alt={course.course_name}
                                className="w-20 h-20 object-cover rounded-2xl border border-orange-200 shadow-sm shrink-0"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center shrink-0 shadow-sm">
                                <BookOpen size={28} className="text-white" strokeWidth={2} />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-2xl font-black text-slate-950">{course.course_name}</h2>
                                <span className={`px-2.5 py-0.5 text-[11px] font-black rounded-full border capitalize ${levelBadge(course.level)}`}>
                                    {course.level || 'N/A'}
                                </span>
                            </div>
                            <p className="text-sm text-orange-600 font-mono font-extrabold mt-0.5">{course.course_code}</p>
                            {course.description && (
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                            )}
                        </div>

                        <span className={`inline-flex items-center px-4 py-1.5 text-sm font-bold rounded-full shrink-0 ${
                            course.is_active
                                ? 'bg-green-50 text-green-700 border border-green-300'
                                : 'bg-slate-100 text-slate-500 border border-slate-300'
                        }`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${course.is_active ? 'bg-green-500' : 'bg-slate-400'}`} />
                            {course.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Info stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <BarChart2 size={18} className="text-orange-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Level</p>
                            <p className="font-bold text-slate-800 capitalize mt-0.5">{course.level || '—'}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <Globe size={18} className="text-orange-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Language</p>
                            <p className="font-bold text-slate-800 mt-0.5">{course.language || '—'}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <Clock size={18} className="text-orange-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Duration</p>
                            <p className="font-bold text-slate-800 mt-0.5">{course.duration_days ? `${course.duration_days} days` : '—'}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <Tag size={18} className="text-orange-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Topics</p>
                            <p className="font-bold text-slate-800 mt-0.5">{topics.length}</p>
                        </div>
                    </div>
                </div>

                {/* Topics table */}
                <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-orange-500/10 flex items-center justify-between">
                        <p className="font-black text-slate-950">Topics</p>
                        <span className="text-xs font-bold text-orange-600">{topics.length} topic{topics.length !== 1 ? 's' : ''}</span>
                    </div>

                    {topics.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm font-semibold">
                            No topics assigned to this course yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-orange-500/5">
                            <div className="grid grid-cols-[3rem_1fr_1fr_auto] gap-4 px-6 py-3 bg-orange-50/60 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                <span>Order</span>
                                <span>Title</span>
                                <span>Description</span>
                                <span>Status</span>
                            </div>
                            {[...topics]
                                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                .map((topic) => (
                                    <div
                                        key={topic._id || topic}
                                        className="grid grid-cols-[3rem_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-orange-50/20 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-black text-orange-700 text-sm">
                                            {typeof topic === 'object' ? (topic.order ?? '—') : '—'}
                                        </div>
                                        <p className="font-bold text-slate-900 text-sm">
                                            {typeof topic === 'object' ? topic.title : topic}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {typeof topic === 'object' ? (topic.description || '—') : '—'}
                                        </p>
                                        {typeof topic === 'object' && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                                                topic.is_active
                                                    ? 'bg-green-50 text-green-700 border-green-300'
                                                    : 'bg-slate-100 text-slate-500 border-slate-300'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${topic.is_active ? 'bg-green-500' : 'bg-slate-400'}`} />
                                                {topic.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </EditorLayout>
    );
}
