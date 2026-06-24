'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import AdminLayout from '../../layouts/AdminLayout';
import InstituteForm from '../../components/form/InstituteForm';
import { createInstitute, getCourses } from '../../services/institute';

export default function NewInstitutePage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getCourses()
            .then((res) => {
                const list = res.data?.data || res.data || [];
                setCourses(Array.isArray(list) ? list : []);
            })
            .catch(() => {});
    }, []);

    const handleSubmit = async (data) => {
        try {
            await createInstitute(data);
            Swal.fire({
                icon: 'success',
                title: 'Institute Created',
                text: `${data.institute_name} has been registered.`,
                timer: 2000,
                showConfirmButton: false,
            });
            router.push('/institutes');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Creation Failed',
                text: err?.response?.data?.message || err.message,
            });
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <InstituteForm
                    courses={courses}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/institutes')}
                />
            </div>
        </AdminLayout>
    );
}
