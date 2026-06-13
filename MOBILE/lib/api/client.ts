// Merkezi API istemcisi (mobil). Web ile aynı mantık; token saklama
// expo-secure-store ile asenkron yapılır, API URL expo config'ten okunur.

import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const API_URL: string =
  (Constants.expoConfig?.extra?.apiUrl as string) ?? "http://10.0.2.2:4000/api";

const ACCESS_KEY = "banasat_access_token";
const REFRESH_KEY = "banasat_refresh_token";

// --- Token saklama (SecureStore - asenkron) ---
export const tokenStore = {
  getAccess: () => SecureStore.getItemAsync(ACCESS_KEY),
  getRefresh: () => SecureStore.getItemAsync(REFRESH_KEY),
  async set(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  },
  async clear() {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};

/** API hatalarını taşıyan özel hata sınıfı. */
export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  isFormData?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = await tokenStore.getRefresh();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        if (!res.ok) return false;
        const json = await res.json();
        const data = json.data ?? json;
        if (data?.accessToken && data?.refreshToken) {
          await tokenStore.set(data.accessToken, data.refreshToken);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setTimeout(() => (refreshPromise = null), 0);
      }
    })();
  }
  return refreshPromise;
}

async function rawRequest<T>(
  path: string,
  options: RequestOptions,
  retrying = false,
): Promise<T> {
  const { method = "GET", body, auth = true, isFormData = false } = options;

  const headers: Record<string, string> = {};
  if (!isFormData) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = await tokenStore.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !retrying) {
    const refreshed = await tryRefresh();
    if (refreshed) return rawRequest<T>(path, options, true);
    await tokenStore.clear();
  }

  if (res.status === 204) return undefined as T;

  let json: { success?: boolean; data?: T; message?: string | string[] };
  try {
    json = await res.json();
  } catch {
    throw new ApiError("Sunucudan geçersiz yanıt alındı.", res.status);
  }

  if (!res.ok) {
    const msg = Array.isArray(json.message)
      ? json.message.join(", ")
      : json.message ?? "Bir hata oluştu.";
    throw new ApiError(msg, res.status);
  }

  return (json.data ?? json) as T;
}

export const api = {
  get: <T>(path: string, auth = true) => rawRequest<T>(path, { method: "GET", auth }),
  post: <T>(path: string, body?: unknown, auth = true) =>
    rawRequest<T>(path, { method: "POST", body, auth }),
  patch: <T>(path: string, body?: unknown, auth = true) =>
    rawRequest<T>(path, { method: "PATCH", body, auth }),
  put: <T>(path: string, body?: unknown, auth = true) =>
    rawRequest<T>(path, { method: "PUT", body, auth }),
  delete: <T>(path: string, auth = true) =>
    rawRequest<T>(path, { method: "DELETE", auth }),
  postForm: <T>(path: string, formData: FormData) =>
    rawRequest<T>(path, { method: "POST", body: formData, isFormData: true }),
};

export { API_URL };
