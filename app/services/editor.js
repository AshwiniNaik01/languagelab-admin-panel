import api from "./api";

export const initialEditors = [];

export const initialInstitutes = [
  { _id: "clg_1", institute_name: "Mumbai University" },
  { _id: "clg_2", institute_name: "Pune Institute of Technology" },
];

// CREATE
export const createEditor = (data, config) => {
  return api.post("/api/editor", data, config);
};

// GET ALL TEACHERS
export const getEditors = (config) => {
  return api.get("/api/editor", config);
};

// GET SINGLE TEACHER
export const getEditorById = (id, config) => {
  return api.get(`/api/editor/${id}`, config);
};

// UPDATE
export const updateEditor = (id, data, config) => {
  return api.put(`/api/editor/${id}`, data, config);
};

// DELETE
export const deleteEditor = (id, config) => {
  return api.delete(`/api/editor/${id}`, config);
};