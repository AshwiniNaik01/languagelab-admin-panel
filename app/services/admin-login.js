import api from "./api";

export const loginAdmin = async (payload) => {
  const response = await api.post(
    "/api/super-admin/login",
    payload
  );

  return response.data;
};



export const loginEditor = async (data) => {
  const response = await api.post("/api/editor/login", data);
  return response.data;
};