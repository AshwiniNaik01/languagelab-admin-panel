"use client";

import InputField from "./InputField";
import Button from "../ui/Button";
import { useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { createEditor, updateEditor } from "../../services/editor";

const getErrorMessage = (error) => {
  if (error?.response?.data) {
    const errorData = error.response.data;
    const msgVal = errorData.message || errorData.errors || errorData.error;

    if (typeof msgVal === "string") {
      return msgVal;
    }
    if (Array.isArray(msgVal)) {
      return msgVal
        .map((err) => {
          if (err && typeof err === "object") {
            return err.message || err.msg || err.error || JSON.stringify(err);
          }
          return String(err);
        })
        .join(", ");
    }
    if (msgVal && typeof msgVal === "object") {
      return msgVal.message || msgVal.msg || msgVal.error || JSON.stringify(msgVal);
    }
    if (typeof errorData === "string") {
      return errorData;
    }
  }
  return error?.message || "Something went wrong";
};

export default function EditorForm({ initialData = {}, onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // ❌ remove empty password
    if (!data.password) delete data.password;

    // ✅ FIX: match schema field name
    if (data.profileImage) {
      data.profilePhoto = data.profileImage;
      delete data.profileImage;
    }

    // ✅ default values for backend schema
    data.status = data.status || "active";
    data.is_active = data.is_active !== "false";

    try {
      setLoading(true);

      const token = Cookies.get("token");

      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",


        },
      };


      let response;

      if (initialData._id) {
        response = await updateEditor(initialData._id, data, config);

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Editor updated successfully",
        });
      } else {
        response = await createEditor(data, config);

        console.log("API Response:", response.data);

        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Editor created successfully",
        });
      }

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border"
    >
      <h3 className="text-lg font-bold text-black ">
        {initialData._id ? "Edit Editor" : "Create Editor"}
      </h3>

      {/* FULL NAME + EMAIL */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          name="full_name"
          defaultValue={initialData.full_name}
          required
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={initialData.email}
          required
        />
      </div>

      {/* PASSWORD + ROLE */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder={
            initialData._id ? "Leave blank to keep old password" : ""
          }
          required={!initialData._id}
        />

        <InputField
          label="Role"
          name="role"
          defaultValue={initialData.role || "editor"}
        />
      </div>

      {/* PHONE + PROFILE PHOTO */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Phone"
          name="phone"
          defaultValue={initialData.phone}
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Profile Photo
        </label>

        <input
          type="file"
          accept="image/*"
          name="profilePhoto"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData._id ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
