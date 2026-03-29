/**
 * Authenticated API client — automatically attaches JWT token to requests.
 * Reads from unified 'auth_token' key (with legacy 'admin_token' fallback).
 */

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('auth_token') ??
    localStorage.getItem('admin_token') ??
    null
  );
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    ['auth_token','auth_user','admin_token','admin_user'].forEach(k => localStorage.removeItem(k));
    window.location.href = '/sign-in?error=session_expired';
    throw new Error('Session expired');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

export const api = {
  get:    <T>(url: string) =>
    fetch(url, { headers: authHeaders() }).then(res => handleResponse<T>(res)),

  post:   <T>(url: string, body: unknown) =>
    fetch(url, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) })
      .then(res => handleResponse<T>(res)),

  put:    <T>(url: string, body: unknown) =>
    fetch(url, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) })
      .then(res => handleResponse<T>(res)),

  delete: <T>(url: string) =>
    fetch(url, { method: 'DELETE', headers: authHeaders() }).then(res => handleResponse<T>(res)),
};

// ── Domain helpers ────────────────────────────────────────────────────────────

export const blogsApi = {
  list:   (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<{ blogs: unknown[]; total: number }>(`/api/blogs${qs}`);
  },
  create: (data: unknown) => api.post('/api/blogs', data),
  update: (id: string, data: unknown) => api.put(`/api/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/api/blogs/${id}`),
};

export const propertiesApi = {
  list:   (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<{ properties: unknown[]; total: number }>(`/api/properties${qs}`);
  },
  create: (data: unknown) => api.post('/api/properties', data),
  update: (id: string, data: unknown) => api.put(`/api/properties/${id}`, data),
  delete: (id: string) => api.delete(`/api/properties/${id}`),
};

export const agentsApi = {
  list:   (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<unknown[]>(`/api/agents${qs}`);
  },
  create: (data: unknown) => api.post('/api/agents', data),
  update: (id: string, data: unknown) => api.put(`/api/agents/${id}`, data),
  delete: (id: string) => api.delete(`/api/agents/${id}`),
};

export const messagesApi = {
  list:    (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<unknown[]>(`/api/contact${qs}`);
  },
  markRead: (id: string) => api.put(`/api/messages/${id}`, { read: true }),
  delete:   (id: string) => api.delete(`/api/messages/${id}`),
};

export const adminsApi = {
  list:   () => api.get<unknown[]>('/api/admins'),
  create: (data: unknown) => api.post('/api/admins', data),
  update: (id: string, data: unknown) => api.put(`/api/admins/${id}`, data),
  delete: (id: string) => api.delete(`/api/admins/${id}`),
};

// ── New: inquiries & saved properties ────────────────────────────────────────

export const inquiriesApi = {
  send:    (data: { propertyId: string; message: string; phone?: string }) =>
    api.post<unknown>('/api/inquiries', data),
  myList:  () => api.get<unknown[]>('/api/inquiries?mine=true'),
  allList: () => api.get<unknown[]>('/api/inquiries'),
  markRead: (id: string) => api.put(`/api/inquiries/${id}`, { read: true }),
  delete:  (id: string)  => api.delete(`/api/inquiries/${id}`),
};

export const savedApi = {
  list:   () => api.get<{ savedProperties: unknown[] }>('/api/user/saved'),
  toggle: (propertyId: string) => api.post<{ saved: boolean; savedProperties: string[] }>('/api/user/saved', { propertyId }),
};

export const profileApi = {
  get:    () => api.get<{ user: unknown }>('/api/user/profile'),
  update: (data: { name?: string; avatar?: string }) => api.put<{ user: unknown }>('/api/user/profile', data),
};
