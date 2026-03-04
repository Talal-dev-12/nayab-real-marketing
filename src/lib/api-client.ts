/**
 * Authenticated API client — automatically attaches JWT token to requests.
 * Use this in all admin pages instead of raw fetch().
 */

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
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
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
    throw new Error('Session expired');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  get: <T>(url: string) =>
    fetch(url, { headers: authHeaders() }).then(res => handleResponse<T>(res)),

  post: <T>(url: string, body: unknown) =>
    fetch(url, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) })
      .then(res => handleResponse<T>(res)),

  put: <T>(url: string, body: unknown) =>
    fetch(url, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) })
      .then(res => handleResponse<T>(res)),

  delete: <T>(url: string) =>
    fetch(url, { method: 'DELETE', headers: authHeaders() }).then(res => handleResponse<T>(res)),
};

// Convenience wrappers
export const blogsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<{ blogs: unknown[]; total: number }>(`/api/blogs${qs}`);
  },
  create: (data: unknown) => api.post('/api/blogs', data),
  update: (id: string, data: unknown) => api.put(`/api/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/api/blogs/${id}`),
};

export const propertiesApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<{ properties: unknown[]; total: number }>(`/api/properties${qs}`);
  },
  create: (data: unknown) => api.post('/api/properties', data),
  update: (id: string, data: unknown) => api.put(`/api/properties/${id}`, data),
  delete: (id: string) => api.delete(`/api/properties/${id}`),
};

export const agentsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<unknown[]>(`/api/agents${qs}`);
  },
  create: (data: unknown) => api.post('/api/agents', data),
  update: (id: string, data: unknown) => api.put(`/api/agents/${id}`, data),
  delete: (id: string) => api.delete(`/api/agents/${id}`),
};

export const messagesApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<unknown[]>(`/api/contact${qs}`);
  },
  markRead: (id: string) => api.put(`/api/messages/${id}`, { read: true }),
  delete: (id: string) => api.delete(`/api/messages/${id}`),
};

export const adminsApi = {
  list: () => api.get<unknown[]>('/api/admins'),
  create: (data: unknown) => api.post('/api/admins', data),
  update: (id: string, data: unknown) => api.put(`/api/admins/${id}`, data),
  delete: (id: string) => api.delete(`/api/admins/${id}`),
};
