// client/src/lib/config.ts
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
