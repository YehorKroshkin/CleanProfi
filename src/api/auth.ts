export type RegisterPayload = {
  name: string
  city: string
  district: string
  street: string
  phone: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type UserProfile = {
  id?: string
  name: string
  city: string
  district: string
  street: string
  phone: string
  email: string
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

type ApiError = {
  message: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as Partial<ApiError>
    throw new Error(data.message || 'Request failed')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export async function registerUser(payload: RegisterPayload) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse<{ message: string; user: UserProfile }>(response)
}

export async function loginUser(payload: LoginPayload) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse<{ user: UserProfile }>(response)
}

export async function getCurrentUser() {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  })

  return parseResponse<{ user: UserProfile }>(response)
}

export async function logoutUser() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  return parseResponse<void>(response)
}

export async function changePassword(payload: ChangePasswordPayload) {
  const response = await fetch('/api/auth/change-password', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse<{ message: string }>(response)
}
