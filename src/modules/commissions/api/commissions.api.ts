import axios, { isAxiosError, isCancel } from "axios";

export class ApiError extends Error {}

const baseURL = String(
  import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "http://localhost:3000" : ""),
).replace(/\/+$/, "");

export const commissionsApi = axios.create({
  baseURL,
  timeout: 90_000,
});

commissionsApi.interceptors.request.use((config) => {
  if (!baseURL) throw new ApiError("Falta configurar VITE_API_URL");
  return config;
});

function getResponseMessage(status: number, data: unknown): string {
  const message = (data as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string") return message;
  return `Error del servidor (${status})`;
}

commissionsApi.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isCancel(error)) return Promise.reject(error);

    if (isAxiosError(error)) {
      if (error.response) {
        return Promise.reject(
          new ApiError(
            getResponseMessage(error.response.status, error.response.data),
          ),
        );
      }
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        return Promise.reject(
          new ApiError("El servidor tardó demasiado en responder"),
        );
      }
      return Promise.reject(
        new ApiError("No se pudo conectar con el servidor"),
      );
    }

    return Promise.reject(error);
  },
);
