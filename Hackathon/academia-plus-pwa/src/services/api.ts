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

export function apiCreatePost<TPost>(token: string, payload: { content: string; type?: string; image?: string }) {
  return request<TPost>('/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export function apiToggleFollow<TFollow>(token: string, userId: string, following: boolean) {
  return request<TFollow>(`/follows/${userId}`, {
    method: following ? 'DELETE' : 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}

