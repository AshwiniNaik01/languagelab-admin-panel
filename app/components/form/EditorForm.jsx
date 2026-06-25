"use client";

import InputField from "./InputField";
import Button from "../ui/Button";
import LogoFileUploader from "./LogoFileUploader";
import { useState } from "react";
import Swal from "sweetalert2";
import { createEditor, updateEditor } from "../../services/editor";
import { newEditorSchema } from "../../schemas/neweditor.schema.js";

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

export default function EditorForm({ initialData = {}, onCancel, onSuccess, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profilePhotoBase64, setProfilePhotoBase64] = useState(initialData.profilePhoto || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // ❌ remove empty password
    if (!data.password) delete data.password;

    data.profilePhoto = profilePhotoBase64;

    // ✅ default values for backend schema
    data.status = data.status || "active";
    data.is_active = data.is_active !== "false";

    // Run Yup validation
    try {
      await newEditorSchema.validate(data, {
        abortEarly: false,
        context: { isEdit: !!initialData._id },
      });
      setErrors({});
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      } else {
        validationErrors[err.path] = err.message;
      }
      setErrors(validationErrors);
      return;
    }

    // If profilePhoto is an empty File object, delete it (especially for edits)
    if (data.profilePhoto && data.profilePhoto instanceof File && data.profilePhoto.size === 0) {
      delete data.profilePhoto;
    }

    try {
      setLoading(true);

      let response;

      if (initialData._id) {
        response = await updateEditor(initialData._id, data);
        Swal.fire({ icon: "success", title: "Updated!", text: "Editor updated successfully" });
      } else {
        response = await createEditor(data);
        Swal.fire({ icon: "success", title: "Created!", text: "Editor created successfully" });
      }

      if (onSubmit) onSubmit(data);
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
      className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl"
    >
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {initialData._id ? "Edit Editor Information" : "Register Editor"}
      </h3>

      {/* Full Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          name="full_name"
          placeholder="e.g. John Doe"
          defaultValue={initialData.full_name}
          error={errors.full_name}
          icon="User"
        />
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. editor@example.com"
          defaultValue={initialData.email}
          error={errors.email}
          icon="Mail"
        />
      </div>

      {/* Password + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder={initialData._id ? "Leave blank to keep current" : "Enter account password"}
          error={errors.password}
          icon="Lock"
          showToggle
          autoComplete="new-password"
          disabled={!!initialData._id}
        />
        <InputField
          label="Phone Number"
          name="phone"
          placeholder="e.g. 9876543210"
          defaultValue={initialData.phone}
          error={errors.phone}
          icon="Phone"
        />
      </div>

      {/* Profile Photo */}
      <LogoFileUploader
        label="Profile Photo"
        uploadedText="Photo uploaded successfully"
        previewAlt="Profile photo preview"
        onFileUploaded={setProfilePhotoBase64}
        initialLogoUrl={initialData.profilePhoto}
      />
      {errors.profilePhoto && (
        <p className="-mt-4 text-sm text-red-500">{errors.profilePhoto}</p>
      )}

      {/* Active status */}
      <div className="flex items-center gap-3.5 py-3 border-t border-orange-500/10">
        <input
          type="checkbox"
          name="is_active"
          id="is_active_editor"
          defaultChecked={initialData.is_active !== false}
          className="accent-orange-500 w-4 h-4 rounded cursor-pointer"
        />
        <label htmlFor="is_active_editor" className="text-sm font-bold text-[#3C1E0A] select-none cursor-pointer">
          Activate this editor immediately
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : initialData._id ? "Update Editor" : "Register Editor"}
        </Button>
      </div>
    </form>
  );
}
