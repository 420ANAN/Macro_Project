export const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  'http://localhost:3000';

export function apiUrl(path) {
  if (!path) return API_BASE_URL;
  const base = API_BASE_URL.replace(/\/+$/, '');
  const p = String(path).startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

