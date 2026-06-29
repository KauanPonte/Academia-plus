const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface ApiAuthResponse<TUser> {
  token: string
  user: TUser
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao comunicar com a API.')
  }

  return data as T
}

// ─── Autenticação ───────────────────────────────────────────────────────────

export function apiLogin<TUser>(email: string, password: string) {
  return request<ApiAuthResponse<TUser>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function apiRegister<TUser>(payload: {
  name: string
  email: string
  password: string
  course?: string
  institution?: string
  bio?: string
}) {
  return request<ApiAuthResponse<TUser>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ─── Usuários ────────────────────────────────────────────────────────────────

export function apiGetMe<T>(token: string) {
  return request<T>('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function apiUpdateMe<T>(token: string, data: Record<string, unknown>) {
  return request<T>('/users/me', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export function apiGetUser<T>(token: string, userId: string) {
  return request<T>(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function apiSearchUsers<T>(token: string, q: string) {
  return request<T>(`/users/search?q=${encodeURIComponent(q)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export function apiFetchPosts<T>(token: string, page = 1, size = 20) {
  return request<T>(`/posts?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function apiCreatePost<TPost>(token: string, payload: { content: string; type?: string; image?: string }) {
  return request<TPost>('/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export function apiLikePost<T>(token: string, postId: string) {
  return request<T>(`/posts/${postId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function apiUnlikePost<T>(token: string, postId: string) {
  return request<T>(`/posts/${postId}/like`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function apiCommentPost<T>(token: string, postId: string, content: string) {
  return request<T>(`/posts/${postId}/comments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content }),
  })
}

// ─── Seguidores ──────────────────────────────────────────────────────────────

export function apiToggleFollow<TFollow>(token: string, userId: string, following: boolean) {
  return request<TFollow>(`/follows/${userId}`, {
    method: following ? 'DELETE' : 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Notificações ────────────────────────────────────────────────────────────

export function apiGetNotifications<T>(token: string) {
  return request<T>('/notifications', {
    headers: { Authorization: `Bearer ${token}` },
  })
}
