"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

import InputField from "../components/form/InputField";
import Button from "../components/ui/Button";
import { loginAdmin } from "../services/admin-login";

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ COOKIE HELPER
  const setCookie = (name, value, days = 1) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginAdmin(formData);

      console.log("Login Response:", response);

      if (response.success) {
        const { token, admin } = response.data;

        // ✅ STORE IN COOKIES
        setCookie("token", token);
        setCookie("admin", JSON.stringify(admin));

        // SUCCESS ALERT
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: response.message || "Welcome back!",
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ ALWAYS REDIRECT TO SAME DASHBOARD
        setTimeout(() => {
          router.push("/");
        }, 1000);

      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center bg-orange-500 text-white p-12">
          <h1 className="text-4xl font-bold mb-4">
            Language Lab
          </h1>

          <p className="text-lg text-orange-100">
            Admin Portal for managing colleges,
            teachers, courses and analytics.
          </p>

          <div className="mt-10 space-y-3">
            <p>✓ Manage Colleges</p>
            <p>✓ Manage Teachers</p>
            <p>✓ Manage Courses</p>
            <p>✓ View Analytics</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Admin Login
            </h2>

            <p className="text-gray-500 mt-2">
              Sign in to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <InputField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[45px] text-gray-500 hover:text-orange-500"
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            © 2026 Language Lab Admin Portal
          </p>
        </div>

      </div>
    </div>
  );
}