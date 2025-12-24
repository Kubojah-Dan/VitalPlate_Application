const API = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(url, options = {}) {
  const { method = "GET", body, token } = options;

  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fullUrl = API
    ? `${API}${url}`       
    : `/api${url}`;         

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  if (!res.ok) {
    if (res.status === 404 && fullUrl.startsWith("/api")) {
      throw new Error(`Request failed 404: ${fullUrl}. It looks like the frontend couldn't reach the backend. Ensure VITE_API_BASE_URL is set to your backend URL in production.`);
    }
    throw new Error(`Request failed: ${res.status} - ${text}`);
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON from", url, "→", text);
    throw err;
  }
}