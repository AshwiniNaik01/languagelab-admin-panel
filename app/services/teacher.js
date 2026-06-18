import api from "./api";

export const initialTeachers = [];

export const initialColleges = [
  { _id: "clg_1", college_name: "Mumbai University" },
  { _id: "clg_2", college_name: "Pune Institute of Technology" },
];

// CREATE
export const createTeacher = (data, config) => {
  return api.post("/api/teacher", data, config);
};

// GET ALL TEACHERS
export const getTeachers = (config) => {
  return api.get("/api/teacher", config);
};

// GET SINGLE TEACHER
export const getTeacherById = (id, config) => {
  return api.get(`/api/teacher/${id}`, config);
};

// UPDATE
export const updateTeacher = (id, data, config) => {
  return api.put(`/api/teacher/${id}`, data, config);
};

// DELETE
export const deleteTeacher = (id, config) => {
  return api.delete(`/api/teacher/${id}`, config);
};