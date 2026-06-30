import api from "./api";
import { base64ToBlob } from "@/app/utils/imageUtils";

// ── Profile ──────────────────────────────────────────────────────────────────
export const getProfile = () => api.get("/api/super-admin/profile");

export const updateProfile = (data) => {
  const fd = new FormData();
  if (data.full_name) fd.append("full_name", data.full_name);
  if (data.phone) fd.append("phone", data.phone);
  if (data.profileImage && data.profileImage.startsWith("data:")) {
    fd.append("profileImage", base64ToBlob(data.profileImage), "profile.webp");
  } else if (data.profileImage) {
    fd.append("existing_profileImage", data.profileImage);
  }
  return api.put("/api/super-admin/profile", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const changePassword = (data) =>
  api.put("/api/super-admin/change-password", data);

// ── Topics ────────────────────────────────────────────────────────────────────
export const getTopics = () => api.get("/api/topic");

// ── License key management (individual keys) ─────────────────────────────────
export const getInstituteLicenses = (instituteId) =>
  api.get(`/api/super-admin/institute/${instituteId}/licenses`);

export const getLicenseKey = (licenseId) => api.get(`/api/license/${licenseId}`);

export const suspendLicense = (licenseId) =>
  api.put(`/api/license/${licenseId}/suspend`);

export const activateLicense = (licenseId) =>
  api.put(`/api/license/${licenseId}/activate`);

export const expireLicense = (licenseId) =>
  api.put(`/api/license/${licenseId}/expire`);

export const renewLicense = (licenseId, payload) =>
  api.put(`/api/license/${licenseId}/renew`, payload);

// ── Session / seat management ─────────────────────────────────────────────────
export const resetInstituteSeats = (instituteId) =>
  api.post(`/api/super-admin/institute/${instituteId}/reset-seats`);
