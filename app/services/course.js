import api from "./api";

export const getCourses = ()         => api.get("/api/super-admin/course");
export const getCourse  = (id)       => api.get(`/api/super-admin/course/${id}`);
export const createCourse = (data)   => api.post("/api/super-admin/course", data);
export const updateCourse = (id, data) => api.put(`/api/super-admin/course/${id}`, data);
export const deleteCourse = (id)     => api.delete(`/api/super-admin/course/${id}`);
