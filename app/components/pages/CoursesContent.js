'use client';

import { useState } from 'react';
import ScrollableTable from '../Table';
import Button from '../ui/Button';
import CourseForm from '../form/CourseForm';
import ToggleSwitch from '../form/ToggleSwitch';

export default function CoursesContent() {
    const [courses, setCourses] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const handleSubmit = (data) => {
        if (editingCourse) {
            setCourses((prev) =>
                prev.map((course) =>
                    course._id === editingCourse._id ? { ...course, ...data } : course,
                ),
            );
        } else {
            setCourses((prev) => [
                ...prev,
                {
                    _id: Date.now().toString(),
                    ...data,
                    is_active: true,
                    createdAt: new Date(),
                },
            ]);
        }

        setIsFormOpen(false);
        setEditingCourse(null);
    };

    const handleStatusToggle = (course, value) => {
        setCourses((prev) =>
            prev.map((c) => (c._id === course._id ? { ...c, is_active: value } : c)),
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h2 className="text-2xl  text-amber-900 font-bold">Courses</h2>

                {/* <Button onClick={() => setIsFormOpen(true)}>
          Add Course
        </Button> */}
            </div>

            {isFormOpen && (
                <CourseForm
                    initialData={editingCourse || {}}
                    onCancel={() => setIsFormOpen(false)}
                    onSuccess={handleSubmit}
                />
            )}

            <ScrollableTable
                data={courses}
                columns={[
                    {
                        header: 'Course Name',
                        accessor: 'course_name',
                    },
                    {
                        header: 'Course Code',
                        accessor: 'course_code',
                    },
                    {
                        header: 'Duration',
                        accessor: 'duration',
                    },
                    {
                        header: 'Description',
                        accessor: 'description',
                    },
                    {
                        header: 'Status',
                        accessor: (row) => (
                            <ToggleSwitch
                                checked={row.is_active}
                                onChange={(value) => handleStatusToggle(row, value)}
                            />
                        ),
                    },
                    {
                        header: 'Created At',
                        accessor: (row) =>
                            row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
                    },
                ]}
            />
        </div>
    );
}
