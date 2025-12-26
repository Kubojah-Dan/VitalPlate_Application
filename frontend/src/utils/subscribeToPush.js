import { apiFetch } from "../apiClient";

export async function subscribeUser(token) {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  });

  await apiFetch('/notifications/subscribe', { method: 'POST', token, body: subscription });
}
