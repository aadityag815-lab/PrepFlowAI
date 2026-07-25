import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem("prepflow_user");
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);

// DSA
export const getDSAProblems = (params) => API.get("/dsa", { params });
export const addDSAProblem = (data) => API.post("/dsa", data);
export const updateDSAProblem = (id, data) => API.put(`/dsa/${id}`, data);
export const deleteDSAProblem = (id) => API.delete(`/dsa/${id}`);
export const getDSAStats = () => API.get("/dsa/stats");

// Company
export const getCompanies = (params) => API.get("/company", { params });
export const addCompany = (data) => API.post("/company", data);
export const updateCompany = (id, data) => API.put(`/company/${id}`, data);
export const deleteCompany = (id) => API.delete(`/company/${id}`);
export const getCompanyStats = () => API.get("/company/stats");

// Resume
export const getResumes = () => API.get("/resume");
export const uploadResume = (data) => API.post("/resume", data);
export const updateResume = (id, data) => API.put(`/resume/${id}`, data);
export const deleteResume = (id) => API.delete(`/resume/${id}`);
export const setDefaultResume = (id) => API.put(`/resume/${id}/default`);

// Study
export const getStudySessions = (params) => API.get("/study", { params });
export const addStudySession = (data) => API.post("/study", data);
export const updateStudySession = (id, data) => API.put(`/study/${id}`, data);
export const deleteStudySession = (id) => API.delete(`/study/${id}`);
export const getStudyStats = () => API.get("/study/stats");

// AI
export const generateStudyPlan = (data) => API.post("/ai/study-plan", data);
export const analyzeInterviewExperience = (data) =>
  API.post("/ai/analyze-experience", data);

export default API;
