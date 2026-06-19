"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

import InputField from "../components/form/InputField";
import Button from "../components/ui/Button";

import { loginAdmin, loginTeacher } from "../services/admin-login";

export default function LoginPage() {
  const router = useRouter();

  const [isTeacher, setIsTeacher] = useState(false);

  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [teacherData, setTeacherData] = useState({ email: "", password: "" });

  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setCookie = (name, value, days = 1) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const handleAdminChange = (e) => {
    setAdminData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTeacherChange = (e) => {
    setTeacherData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await loginAdmin(adminData);

      if (response.success) {
        const { token, admin } = response.data;

        setCookie("token", token);
        setCookie("admin", JSON.stringify(admin));

        Swal.fire({
          icon: "success",
          title: "Admin Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => router.push("/"), 1000);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await loginTeacher(teacherData);

      if (response.success) {
        const { token, teacher } = response.data;

        setCookie("token", token);
        setCookie("teacher", JSON.stringify(teacher));

        Swal.fire({
          icon: "success",
          title: "Teacher Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => router.push("/teacher"), 1000);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.response?.data?.message || "Something went wrong",
      });
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
          ${isTeacher ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
        >
          <div className="h-full flex items-center justify-center p-8">

            <form className="w-full max-w-sm space-y-4">

              <h2 className="text-2xl font-bold">Admin Login</h2>

              <InputField
                label="Email"
                name="email"
                type="email"
                value={adminData.email}
                onChange={handleAdminChange}
                required
              />

              <div className="relative">
                <InputField
                  label="Password"
                  name="password"
                  type={showAdminPassword ? "text" : "password"}
                  value={adminData.password}
                  onChange={handleAdminChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-4 top-[45px]"
                >
                  {showAdminPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <Button
                onClick={handleAdminLogin}
                type="submit"
                className="w-full"
                disabled={loading}
              >
                Login as Admin
              </Button>

            </form>
          </div>
        </div>

        {/* TEACHER FORM */}
        <div
          className={`absolute top-0 right-0 h-full w-1/2 transition-all duration-700 ease-in-out
          ${isTeacher ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
        >
          <div className="h-full flex items-center justify-center p-8">

            <form className="w-full max-w-sm space-y-4">

              <h2 className="text-2xl font-bold">Teacher Login</h2>

              <InputField
                label="Email"
                name="email"
                type="email"
                value={teacherData.email}
                onChange={handleTeacherChange}
                required
              />

              <div className="relative">
                <InputField
                  label="Password"
                  name="password"
                  type={showTeacherPassword ? "text" : "password"}
                  value={teacherData.password}
                  onChange={handleTeacherChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                  className="absolute right-4 top-[45px]"
                >
                  {showTeacherPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <Button
                onClick={handleTeacherLogin}
                type="submit"
                className="w-full"
                disabled={loading}
              >
                Login as Teacher
              </Button>

            </form>
          </div>
        </div>

        {/* SLIDER PANEL */}
        <div
          className={`absolute top-0 h-full w-1/2 overflow-hidden transition-all duration-700 ease-in-out z-20
          ${isTeacher ? "translate-x-0" : "translate-x-full"}`}
        >

          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600" />

          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-white/10" />

          <div className="relative h-full flex items-center justify-center p-10 text-center">

            <div className="max-w-sm">

              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-5xl">{isTeacher ? "🎓" : "🛡️"}</span>
              </div>

              <h1 className="text-4xl font-extrabold mb-4 text-white">
                {isTeacher ? "Teacher Portal" : "Admin Dashboard"}
              </h1>

              <p className="text-white/90 text-lg leading-relaxed mb-8">
                {isTeacher
                  ? "Manage courses, learning modules, assessments and student activities."
                  : "Manage colleges, teachers, courses, reports and analytics."}
              </p>

              <button
                onClick={() => setIsTeacher(!isTeacher)}
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
                "
              >
                {isTeacher ? "Switch to Admin" : "Switch to Teacher"}
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}