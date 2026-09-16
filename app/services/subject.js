import api from "./api";

export const getSubjects = () =>
  api.get("/api/subject");

export const getSubject = (id) =>
  api.get(`/api/subject/${id}`);

export const createSubject = (data) =>
  api.post("/api/subject", data);

export const updateSubject = (id, data) =>
  api.put(`/api/subject/${id}`, data);

export const deleteSubject = (id) =>
  api.delete(`/api/subject/${id}`);