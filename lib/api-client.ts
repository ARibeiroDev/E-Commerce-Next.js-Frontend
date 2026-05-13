import { refreshToken } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type FetchOpts = RequestInit & {
  requiresAuth?: boolean;
  _retry?: boolean;
};

// Prevents multiple refresh requests at once
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function apiFetch<T>(
  endpoint: string,
  options?: FetchOpts,
): Promise<T> {
  const requiresAuth = options?.requiresAuth ?? false;

  // Builds and executes a request
  const makeRequest = async (): Promise<Response> => {
    const token = useAuthStore.getState().accessToken;

    return fetch(`${API_URL}/${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options?.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      },
    });
  };

  const res = await makeRequest();

  // Unauthorized
  if (res.status === 401 && requiresAuth && !options?._retry) {
    if (!isRefreshing) {
      isRefreshing = true;

      // only ONE refresh request even if 10 requests fail simultaneously
      refreshPromise = refreshToken()
        .then((data) => {
          if (data?.accessToken) {
            useAuthStore.setState({
              accessToken: data.accessToken,
              user: data.user,
              isAuthenticated: true,
            });
            return data.accessToken;
          }
          return null;
        })
        .catch(() => null)
        .finally(() => {
          isRefreshing = false;
        });
    }

    const newToken = await refreshPromise;

    // refresh failed
    if (!newToken) {
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // TODO: replace this with new error unauthorized, let provider handler logout/redirection
      }
      throw new Error("Session expired, please log in again.");
    }

    // retry original request once with new token
    return apiFetch<T>(endpoint, {
      ...options,
      _retry: true,
    });
  }

  // Response parsing and error handling
  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.message?.message === "string"
          ? data.message.message
          : Array.isArray(data?.message)
            ? data.message.join(", ")
            : `Request failed with status ${res.status}`;

    throw new Error(message);
  }

  return data as T;
}
