import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// ─── Attach token to every request ───────────────────────────────────────────

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ─── Handle 401 globally ──────────────────────────────────────────────────────

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const register = (data) =>
    api.post("/api/auth/register", data).then((r) => r.data);

export const login = (data) =>
    api.post("/api/auth/login", data).then((r) => r.data);

export const getMe = () =>
    api.get("/api/auth/me").then((r) => r.data);

// ─── Generate ─────────────────────────────────────────────────────────────────

export const generate = (data) =>
    api.post("/api/generate", data).then((r) => r.data);

export const getGenerations = () =>
    api.get("/api/generate").then((r) => r.data);

export const getGeneration = (id) =>
    api.get(`/api/generate/${id}`).then((r) => r.data);

export const deleteGeneration = (id) =>
    api.delete(`/api/generate/${id}`).then((r) => r.data);

// ─── Settings ─────────────────────────────────────────────────────────────────

export const getSettings = () =>
    api.get("/api/settings").then((r) => r.data);

export const updateSettings = (data) =>
    api.put("/api/settings", data).then((r) => r.data);