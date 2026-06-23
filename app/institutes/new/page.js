'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import InstituteForm from '../../components/form/InstituteForm';
import { initialInstitutes } from '../../services/dbService';

export default function NewInstitutePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            // API call to create institute
            const response = await fetch(`/api/institute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    institute_name: data.institute_name,
                    institute_code: data.institute_code,
                    email: data.email,
                    password: data.password,
                    address: data.address,
                    website: data.website,
                    max_students: parseInt(data.max_students) || 100,
                    logo: data.logo || '',
                }),
            });

            const result = await response.json().catch(() => ({}));

            const newInstitute = {
                _id: result.id || 'col_' + Date.now(),
                ...data,
                is_active: true,
                teachers: [],
                created_by: 'superadmin_1',
            };

            const current = JSON.parse(
                localStorage.getItem('lab_institutes') || JSON.stringify(initialInstitutes),
            );
            localStorage.setItem('lab_institutes', JSON.stringify([...current, newInstitute]));
            router.push('/institutes');
        } catch (err) {
            console.error('API error during creation, falling back to local simulation', err);
            // Fallback
            const newInstitute = {
                _id: 'col_' + Date.now(),
                ...data,
                is_active: true,
                teachers: [],
                created_by: 'superadmin_1',
            };
            const current = JSON.parse(
                localStorage.getItem('lab_institutes') || JSON.stringify(initialInstitutes),
            );
            localStorage.setItem('lab_institutes', JSON.stringify([...current, newInstitute]));
            router.push('/institutes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <InstituteForm
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/institutes')}
                />
            </div>
        </AdminLayout>
    );
}
