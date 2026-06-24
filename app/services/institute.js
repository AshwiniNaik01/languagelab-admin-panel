import api from "./api";

const base64ToBlob = (dataUrl) => {
  const [header, body] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(body);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

const buildInstituteFormData = (data) => {
  const fd = new FormData();
  fd.append("institute_name", data.institute_name);
  fd.append("institute_code", data.institute_code);
  fd.append("email", data.email);
  if (data.password) fd.append("password", data.password);
  if (data.phone) fd.append("phone", data.phone);
  if (data.address) fd.append("address", data.address);
  if (data.website) fd.append("website", data.website);
  if (data.max_students) fd.append("max_students", data.max_students);

  // course_id can be a single ID string or an array of IDs
  if (Array.isArray(data.course_id)) {
    data.course_id.forEach((id) => {
      if (id) fd.append("course_id", id);
    });
  } else if (data.course_id) {
    fd.append("course_id", data.course_id);
  }

  if (data.logo && data.logo.startsWith("data:")) {
    fd.append("logo", base64ToBlob(data.logo), "logo.webp");
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
  api.put(`/api/institute/${id}`, {
    institute_name: data.institute_name,
    address: data.address,
    phone: data.phone,
    website: data.website,
    max_students: data.max_students,
  });

export const deleteInstitute = (id) => api.delete(`/api/institute/${id}`);

export const toggleInstituteStatus = (id) =>
  api.put(`/api/institute/${id}/toggle-status`);

// Fixed URL: was /api/super-admin/api/institute/... (duplicate /api)
export const generateLicense = (instituteId, payload) =>
  api.put(`/api/super-admin/institute/${instituteId}/license`, payload);

export const getCourses = () => api.get("/api/super-admin/course");
