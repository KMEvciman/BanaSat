// Merkezi API istemcisi: token yönetimi, otomatik refresh, hata yönetimi.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const ACCESS_KEY = "banasat_access_token";
const REFRESH_KEY = "banasat_refresh_token";

// --- Token saklama (localStorage) ---

export const tokenStore = {
  getAccess(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_KEY);
  },
  getRefresh(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },
  set(accessToken: string, refreshToken: string) {
    window.localStorage.setItem(ACCESS_KEY, accessToken);
    window.localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear() {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
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
  auth?: boolean; // Authorization başlığı eklensin mi (varsayılan: true)
  isFormData?: boolean;
}

// Eşzamanlı 401'lerde tek bir refresh isteği yapmak için paylaşılan promise.
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
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
          tokenStore.set(data.accessToken, data.refreshToken);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        // Promise'i bir sonraki döngüde sıfırla.
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
    const token = tokenStore.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  // 401: access token süresi dolmuş olabilir; bir kez refresh dene.
  if (res.status === 401 && auth && !retrying) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return rawRequest<T>(path, options, true);
    }
    tokenStore.clear();
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

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
  delete: <T>(path: string, auth = true) =>
    rawRequest<T>(path, { method: "DELETE", auth }),
  postForm: <T>(path: string, formData: FormData) =>
    rawRequest<T>(path, { method: "POST", body: formData, isFormData: true }),
};

export { API_URL };
