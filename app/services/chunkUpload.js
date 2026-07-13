import api from "./api";

// Chunked/resumable large-file upload — used for video/audio module content
// instead of sending the whole file in one multipart request. Mirrors the
// backend's /api/upload/chunk/* endpoints (init -> chunk -> status -> complete).
export const chunkUploadApi = {
  init: (payload) => api.post("/api/upload/chunk/init", payload),

  uploadChunk: (uploadId, chunkIndex, blob, { signal, onUploadProgress } = {}) => {
    const formData = new FormData();
    formData.append("chunk", blob);
    return api.post(`/api/upload/chunk/${uploadId}/${chunkIndex}`, formData, {
      headers: { "Content-Type": undefined },
      signal,
      onUploadProgress,
    });
  },

  getStatus: (uploadId) => api.get(`/api/upload/chunk/${uploadId}/status`),

  complete: (uploadId) => api.post(`/api/upload/chunk/${uploadId}/complete`),
};
