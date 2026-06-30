'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import InputField from '../components/form/InputField';
import Button from '../components/ui/Button';
import { adminSchema } from '../schemas/admin.schema.js';
import { editorSchema } from '../schemas/editor.schema.js';
import { loginAdmin, loginEditor } from '../services/admin-login';

const getErrorMessage = (error) => {
    if (error?.response?.data) {
        const errorData = error.response.data;

        // We check message, errors, or error in order
        const msgVal = errorData.message || errorData.errors || errorData.error;

        if (typeof msgVal === 'string') {
            return msgVal;
        }
        if (Array.isArray(msgVal)) {
            return msgVal
                .map((err) => {
                    if (err && typeof err === 'object') {
                        return err.message || err.msg || err.error || JSON.stringify(err);
                    }
                    return String(err);
                })
                .join(', ');
        }
        if (msgVal && typeof msgVal === 'object') {
            return msgVal.message || msgVal.msg || msgVal.error || JSON.stringify(msgVal);
        }
        if (typeof errorData === 'string') {
            return errorData;
        }
    }
    return error?.message || 'Something went wrong';
};

export default function LoginPage() {
    const router = useRouter();

    const [errors, setErrors] = useState({});
    const [isEditor, setIsEditor] = useState(false);

    const [adminData, setAdminData] = useState({ email: '', password: '' });
    const [editorData, setEditorData] = useState({ email: '', password: '' });

    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const [showEditorPassword, setShowEditorPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const setCookie = (name, value, days = 1) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    };

    const handleAdminChange = async (e) => {
        const field = e.target.name;
        const value = e.target.value;
        const newData = { ...adminData, [field]: value };
        setAdminData(newData);

        try {
            await adminSchema.validate(newData, { abortEarly: false });
            setErrors({});
        } catch (error) {
            const validationErrors = {};
            if (error.inner) {
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
            } else {
                validationErrors[error.path] = error.message;
            }
            setErrors((prev) => {
                if (Object.keys(prev).length === 0) return prev;
                const next = { ...prev };
                Object.keys(prev).forEach((key) => {
                    if (!validationErrors[key]) {
                        delete next[key];
                    } else {
                        next[key] = validationErrors[key];
                    }
                });
                return next;
            });
        }
    };

    const handleEditorChange = async (e) => {
        const field = e.target.name;
        const value = e.target.value;
        const newData = { ...editorData, [field]: value };
        setEditorData(newData);

        try {
            await editorSchema.validate(newData, { abortEarly: false });
            setErrors({});
        } catch (error) {
            const validationErrors = {};
            if (error.inner) {
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
            } else {
                validationErrors[error.path] = error.message;
            }
            setErrors((prev) => {
                if (Object.keys(prev).length === 0) return prev;
                const next = { ...prev };
                Object.keys(prev).forEach((key) => {
                    if (!validationErrors[key]) {
                        delete next[key];
                    } else {
                        next[key] = validationErrors[key];
                    }
                });
                return next;
            });
        }
    };

    // const handleAdminLogin = async (e) => {
    //     e.preventDefault();

    //     try {
    //         setLoading(true);
    //         const response = await loginAdmin(adminData);

    //         if (response.success) {
    //             const { token, admin } = response.data;

    //             setCookie('token', token);
    //             setCookie('admin', JSON.stringify(admin));

    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'Admin Login Successful',
    //                 timer: 1500,
    //                 showConfirmButton: false,
    //             });

    //             setTimeout(() => router.push('/'), 1000);
    //         }
    //     } catch (error) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Login Failed',
    //             text: getErrorMessage(error),
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleAdminLogin = async (e) => {
        e.preventDefault();

        try {
            setErrors({});

            await adminSchema.validate(adminData, {
                abortEarly: false,
            });

            setLoading(true);

            const response = await loginAdmin(adminData);

            if (response.success) {
                const { token, admin } = response.data;

                setCookie('token', token);
                setCookie('admin', JSON.stringify(admin));

                Swal.fire({
                    icon: 'success',
                    title: 'Admin Login Successful',
                    timer: 1500,
                    showConfirmButton: false,
                });

                setTimeout(() => router.push('/'), 1000);
            }
        } catch (error) {
            if (error.inner) {
                const validationErrors = {};

                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });

                setErrors(validationErrors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: getErrorMessage(error),
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditorLogin = async (e) => {
        e.preventDefault();

        try {
            setErrors({});

            await editorSchema.validate(editorData, {
                abortEarly: false,
            });

            setLoading(true);
            const response = await loginEditor(editorData);

            if (response.success) {
                const { token, editor } = response.data;

                setCookie('token', token);
                setCookie('editor', JSON.stringify(editor));

                Swal.fire({
                    icon: 'success',
                    title: 'Editor Login Successful',
                    timer: 1500,
                    showConfirmButton: false,
                });

                setTimeout(() => router.push('/editor'), 1000);
            }
        } catch (error) {
            if (error.inner) {
                const validationErrors = {};

                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });

                setErrors(validationErrors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: getErrorMessage(error),
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-6">
            {/* MAIN BOX (FIXED CENTER + SMALL SIZE) */}
            <div className="relative w-full max-w-4xl h-[520px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* ADMIN FORM */}
                <div
                    className={`absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out
          ${isEditor ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                    <div className="h-full flex items-center justify-center p-8">
                        <form className="w-full max-w-sm space-y-4">
                            <h2 className="text-2xl font-bold text-black">Admin Login</h2>

                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={adminData.email}
                                onChange={handleAdminChange}
                                required
                                error={errors.email}
                            />

                            <div className="relative">
                                <InputField
                                    label="Password"
                                    name="password"
                                    type={showAdminPassword ? 'text' : 'password'}
                                    value={adminData.password}
                                    onChange={handleAdminChange}
                                    required
                                    error={errors.password}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                                    className="absolute right-4 top-[45px]">
                                    {showAdminPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <Button
                                onClick={handleAdminLogin}
                                type="submit"
                                className="w-full"
                                disabled={loading}>
                                Login as Admin
                            </Button>
                        </form>
                    </div>
                </div>

                {/* TEACHER FORM */}
                <div
                    className={`absolute top-0 right-0 h-full w-1/2 transition-all duration-700 ease-in-out
          ${isEditor ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                    <div className="h-full flex items-center justify-center p-8">
                        <form className="w-full max-w-sm space-y-4">
                            <h2 className="text-2xl font-bold text-black">Editor Login</h2>

                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={editorData.email}
                                onChange={handleEditorChange}
                                required
                                error={errors.email}
                            />

                            <div className="relative">
                                <InputField
                                    label="Password"
                                    name="password"
                                    type={showEditorPassword ? 'text' : 'password'}
                                    value={editorData.password}
                                    onChange={handleEditorChange}
                                    required
                                    error={errors.password}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowEditorPassword(!showEditorPassword)}
                                    className="absolute right-4 top-[45px]">
                                    {showEditorPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <Button
                                onClick={handleEditorLogin}
                                type="submit"
                                className="w-full"
                                disabled={loading}>
                                Login as Editor
                            </Button>
                        </form>
                    </div>
                </div>

                {/* SLIDER PANEL */}
                <div
                    className={`absolute top-0 h-full w-1/2 overflow-hidden transition-all duration-700 ease-in-out z-20
          ${isEditor ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600" />

                    <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
                    <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/10" />
                    <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-white/10" />

                    <div className="relative h-full flex items-center justify-center p-10 text-center">
                        <div className="max-w-sm">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                                <span className="text-5xl">{isEditor ? '🎓' : '🛡️'}</span>
                            </div>

                            <h1 className="text-4xl font-extrabold mb-4 text-white">
                                {isEditor ? 'Editor Portal' : 'Admin Dashboard'}
                            </h1>

                            <p className="text-white/90 text-lg leading-relaxed mb-8">
                                {isEditor
                                    ? 'Manage courses, learning modules, assessments and student activities.'
                                    : 'Manage institutes, editors, courses, reports and analytics.'}
                            </p>

                            <button
                                onClick={() => {
                                    setIsEditor(!isEditor);
                                    setErrors({});
                                }}
                                className="
                  px-6 py-3
                  bg-white/20
                  backdrop-blur-md
                  border border-white/30
                  text-white
                  rounded-full
                  font-semibold
                  hover:bg-white/30
                  hover:scale-105
                  transition-all
                  duration-300
                ">
                                {isEditor ? 'Switch to Admin' : 'Switch to Editor'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
