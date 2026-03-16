export type ApiErrorPayload = {
  error?: string;
  message?: string;
};

function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return '';
  return base.replace(/\/$/, '');
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getBaseUrl();

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let payload: ApiErrorPayload | null = null;
    try {
      payload = (await res.json()) as ApiErrorPayload;
    } catch {
      // ignore
    }
    const msg = payload?.error || payload?.message || `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return (await res.json()) as T;
}
