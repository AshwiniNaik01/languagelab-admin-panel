import api from "./api";

// ── Profile ──────────────────────────────────────────────────────────────────
export const getProfile = () => api.get("/api/super-admin/profile");

export const updateProfile = (data) => api.put("/api/super-admin/profile", data);

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

// ── Session / seat management ─────────────────────────────────────────────────
export const resetInstituteSeats = (instituteId) =>
  api.post(`/api/super-admin/institute/${instituteId}/reset-seats`);
