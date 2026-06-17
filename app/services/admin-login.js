import api from "./api";

export const loginAdmin = async (payload) => {
  const response = await api.post(
    "/api/super-admin/login",
    payload
  );

  return response.data;
};