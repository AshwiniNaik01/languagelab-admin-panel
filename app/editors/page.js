'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AdminLayout from '../layouts/AdminLayout';
import ScrollableTable from '../components/Table';
import Button from '../components/ui/Button';
import EditorForm from '../components/form/EditorForm';
import ToggleSwitch from '../components/form/ToggleSwitch';
import { getEditors, updateEditor } from '../services/editor';

export default function EditorsPage() {
    const [editors, setEditors] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEditor, setEditingEditor] = useState(null);

    useEffect(() => {
        fetchEditors();
    }, []);

    const fetchEditors = async () => {
        try {
            const token = Cookies.get('token');

            const response = await getEditors({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Editors Response:', response.data);

            setEditors(response.data.data || []);
        } catch (error) {
            console.error('Fetch Editors Error:', error);
        }
    };

    const handleSubmit = async (data) => {
        if (editingEditor) {
            setEditors((prev) =>
                prev.map((t) => (t._id === editingEditor._id ? { ...t, ...data } : t)),
            );
        } else {
            setEditors((prev) => [
                ...prev,
                {
                    _id: 'teach_' + Date.now(),
                    ...data,
                },
            ]);
        }

        await fetchEditors();

        setIsFormOpen(false);
        setEditingEditor(null);
    };

    const handleStatusToggle = async (editor, newValue) => {
        try {
            const token = Cookies.get('token');

            console.log('Editor ID:', editor._id);
            console.log('New Value:', newValue);

            await updateEditor(
                editor._id,
                {
                    is_active: newValue,
                    status: newValue ? 'active' : 'inactive',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setEditors((prev) =>
                prev.map((t) =>
                    t._id === editor._id
                        ? {
                              ...t,
                              is_active: newValue,
                              status: newValue ? 'active' : 'inactive',
                          }
                        : t,
                ),
            );

            await fetchEditors();
        } catch (error) {
            console.error('Toggle Update Error:', error.response?.data || error);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* <div className="flex justify-between">
                    <h2 className="text-2xl text-amber-950 font-bold">Editors</h2>

                    <Button onClick={() => setIsFormOpen(true)}>Add Editor</Button>
                </div> */}

                {isFormOpen && (
                    <EditorForm
                        initialData={editingEditor || {}}
                        onCancel={() => setIsFormOpen(false)}
                        onSuccess={handleSubmit}
                    />
                )}

                <ScrollableTable
                    data={editors}
                    columns={[
                        {
                            header: 'Full Name',
                            accessor: 'full_name',
                        },
                        {
                            header: 'Email',
                            accessor: 'email',
                        },
                        {
                            header: 'Phone',
                            accessor: 'phone',
                        },
                        {
                            header: 'Role',
                            accessor: 'role',
                        },
                        {
                            header: 'Status',
                            accessor: (row) => (
                                <ToggleSwitch
                                    checked={row.is_active}
                                    onChange={(newValue) => handleStatusToggle(row, newValue)}
                                />
                            ),
                        },
                        {
                            header: 'Created By',
                            accessor: (row) => row.created_by?.full_name || '-',
                        },
                        {
                            header: 'Created At',
                            accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
                        },
                    ]}
                />
            </div>
        </AdminLayout>
    );
}
