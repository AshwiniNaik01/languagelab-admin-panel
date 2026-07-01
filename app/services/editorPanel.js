import api from "./api";
import { cachedFetch, invalidateCache } from "../utils/apiCache";

// ── Editor Profile ────────────────────────────────────────────────────────────
export const getEditorProfile    = ()     => api.get("/api/editor/me");
export const updateEditorProfile = (data) => api.put("/api/editor/me", data, { headers: { "Content-Type": undefined } });
export const changeEditorPassword = (data) => api.put("/api/editor/me/change-password", data);

// ── Courses ───────────────────────────────────────────────────────────────────
export const getEditorCourses   = ()           => api.get("/api/editor/course");
export const getEditorCourse    = (id)         => api.get(`/api/editor/course/${id}`);
export const createEditorCourse = (data)       => api.post("/api/editor/course", data);
export const updateEditorCourse = (id, data)   => api.put(`/api/editor/course/${id}`, data);
export const deleteEditorCourse = (id)         => api.delete(`/api/editor/course/${id}`);

// ── Topics (cached — fetched by every module form; 5-min TTL) ─────────────────
export const getTopics    = ()         => cachedFetch("topics", () => api.get("/api/topic"));
export const getTopic     = (id)       => api.get(`/api/topic/${id}`);
export const createTopic  = (data)     => api.post("/api/topic", data).then(r => { invalidateCache("topics"); return r; });
export const updateTopic  = (id, data) => api.put(`/api/topic/${id}`, data).then(r => { invalidateCache("topics"); return r; });
export const deleteTopic  = (id)       => api.delete(`/api/topic/${id}`).then(r => { invalidateCache("topics"); return r; });

// ── SubTopics (cached per topicId) ───────────────────────────────────────────
export const getSubTopics    = (topicId)       => cachedFetch(`subtopics:${topicId}`, () => api.get(`/api/subtopic/topic/${topicId}`));
export const getSubTopic     = (id)            => api.get(`/api/subtopic/${id}`);
export const createSubTopic  = (data)          => api.post("/api/subtopic", data).then(r => { invalidateCache(`subtopics:${data.topic_id}`); return r; });
export const updateSubTopic  = (id, data)      => api.put(`/api/subtopic/${id}`, data).then(r => { invalidateCache(`subtopics:${data.topic_id}`); return r; });
export const deleteSubTopic  = (id)            => api.delete(`/api/subtopic/${id}`);

// ── Modules ───────────────────────────────────────────────────────────────────
export const getModules    = (type, subtopicId) => api.get(`/api/module/${type}?subtopic_id=${subtopicId}`);
export const getModule     = (type, id)         => api.get(`/api/module/${type}/${id}`);
export const createVideoModule      = (data)    => api.post("/api/module/video", data, { headers: { "Content-Type": undefined } });
export const createAudioModule      = (data)    => api.post("/api/module/audio", data, { headers: { "Content-Type": undefined } });
export const createTextModule       = (data)    => api.post("/api/module/text", data);
export const createExerciseModule   = (data)    => api.post("/api/module/exercise", data);
export const createVocabularyModule = (data)    => api.post("/api/module/vocabulary", data);
export const updateModule  = (type, id, data)   => api.put(`/api/module/${type}/${id}`, data);
export const deleteModule  = (type, id)         => api.delete(`/api/module/${type}/${id}`);

// ── Student monitoring (read-only for editor) ─────────────────────────────────
export const getStudentActivity   = (studentId) => api.get(`/api/activity/student/${studentId}`);
export const getStudentProgress   = (studentId) => api.get(`/api/progress/student/${studentId}`);
export const getStudentAttendance = (studentId) => api.get(`/api/attendance/student/${studentId}`);
