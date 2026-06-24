import api from "./api";

const buildStudentFormData = (data) => {
  const fd = new FormData();
  const fields = ["full_name", "roll_no", "enrollment_no", "institute_id",
                  "email", "phone", "batch", "course", "year"];
  fields.forEach((key) => {
    if (data[key] !== undefined && data[key] !== "") fd.append(key, data[key]);
  });
  if (data.studentPhoto instanceof File && data.studentPhoto.size > 0) {
    fd.append("studentPhoto", data.studentPhoto);
  }
  return fd;
};

export const getStudents = () => api.get("/api/student");

export const createStudent = (data) =>
  api.post("/api/student", buildStudentFormData(data), {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateStudent = (id, data) =>
  api.put(`/api/student/${id}`, {
    full_name: data.full_name,
    roll_no: data.roll_no,
    batch: data.batch,
    status: data.status,
  });

export const deleteStudent = (id) => api.delete(`/api/student/${id}`);

export const toggleStudentStatus = (id) =>
  api.put(`/api/student/${id}/toggle-status`);
