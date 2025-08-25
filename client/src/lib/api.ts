// same-origin API base (no 5173, no absolute URL)
const API = ""; // empty = same origin, e.g. http://localhost:5000

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(API + path, { headers: { "Content-Type": "application/json" }, credentials: "include", ...init });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<T>;
}

export const get = <T>(p: string) => req<T>(p);
export const post = <T>(p: string, body: any) => req<T>(p, { method: "POST", body: JSON.stringify(body) });
export const put = <T>(p: string, body: any) => req<T>(p, { method: "PUT", body: JSON.stringify(body) });
export const del = (p: string) => req<unknown>(p, { method: "DELETE" });
export { API };
