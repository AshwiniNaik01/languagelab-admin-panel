import api from "./api";
import { base64ToBlob } from "@/app/utils/imageUtils";

const buildInstituteFormData = (data) => {
  const fd = new FormData();
  fd.append("institute_name", data.institute_name);
  fd.append("institute_code", data.institute_code);
  fd.append("email", data.email);
  if (data.password) fd.append("password", data.password);
  if (data.phone) fd.append("phone", data.phone);
  if (data.address && typeof data.address === "object") {
    fd.append("address", JSON.stringify(data.address));
  }
  if (data.website) fd.append("website", data.website);
  if (data.max_students) fd.append("max_students", data.max_students);
  if (data.is_active !== undefined) fd.append("is_active", data.is_active);

  // course_id can be a single ID string or an array of IDs
  if (Array.isArray(data.course_id)) {
    data.course_id.forEach((id) => {
      if (id) fd.append("course_id", id);
    });
  } else if (data.course_id) {
    fd.append("course_id", data.course_id);
  }

  if (data.logo && data.logo.startsWith("data:")) {
    // New image selected — send as file so backend uploads to AWS
    fd.append("logo", base64ToBlob(data.logo), "logo.webp");
  } else if (data.logo) {
    // Existing CDN URL — pass as text so backend can preserve it
    fd.append("existing_logo", data.logo);
  }

  return fd;
};

export const getInstitutes = () => api.get("/api/institute");

export const getInstituteById = (id) => api.get(`/api/institute/${id}`);

export const createInstitute = (data) =>
  api.post("/api/institute", buildInstituteFormData(data), {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateInstitute = (id, data) =>
  api.put(`/api/institute/${id}`, buildInstituteFormData(data), {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteInstitute = (id) => api.delete(`/api/institute/${id}`);

export const toggleInstituteStatus = (id) =>
  api.put(`/api/institute/${id}/toggle-status`);

// Fixed URL: was /api/super-admin/api/institute/... (duplicate /api)
export const generateLicense = (instituteId, payload) =>
  api.put(`/api/super-admin/institute/${instituteId}/license`, payload);

export const getCourses = () => api.get("/api/super-admin/course");
