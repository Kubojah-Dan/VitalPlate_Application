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
