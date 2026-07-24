import api from "./api";

const base64ToBlob = (base64) => {
  const [header, body] = base64.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
};

const buildEditorFormData = (data) => {
  const fd = new FormData();
  if (data.full_name) fd.append("full_name", data.full_name);
  if (data.email) fd.append("email", data.email);
  if (data.password) fd.append("password", data.password);
  if (data.phone) fd.append("phone", data.phone);
  if (data.profilePhoto instanceof File && data.profilePhoto.size > 0) {
    fd.append("profilePhoto", data.profilePhoto);
  } else if (typeof data.profilePhoto === "string" && data.profilePhoto.startsWith("data:")) {
    const blob = base64ToBlob(data.profilePhoto);
    fd.append("profilePhoto", blob, "profile.webp");
  }
  return fd;
};

export const getEditors = () => api.get("/api/editor");

export const getEditorById = (id) => api.get(`/api/editor/${id}`);

// POST /api/editor — multipart/form-data (profilePhoto file upload)
// Content-Type left unset so the browser can compute the multipart boundary itself
export const createEditor = (data) =>
  api.post("/api/editor", buildEditorFormData(data), {
    headers: { "Content-Type": undefined },
  });

// PUT /api/editor/:id — JSON body (no file, just profile fields + status)
export const updateEditor = (id, data) =>
  api.put(`/api/editor/${id}`, {
    full_name: data.full_name,
    phone: data.phone,
    status: data.status || "active",
  });

export const deleteEditor = (id) => api.delete(`/api/editor/${id}`);

export const toggleEditorStatus = (id) =>
  api.put(`/api/editor/${id}/toggle-status`);

export const assignEditorInstitutes = (id, institute_ids) =>
  api.put(`/api/editor/${id}/assign-institute`, { institute_ids });
