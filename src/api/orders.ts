type ApiError = {
  message: string
}

export type CreateOrderPayload = {
  name: string
  phone: string
  city: string
  address: string
  area: number
  objectType: 'apartment' | 'house' | 'office' | 'garage'
  serviceItems: Array<'regular' | 'deep' | 'post_renovation'>
  date: string
  time: string
  comment?: string
}

export type CreatedOrder = {
  id: string
  orderNumber: string
  estimatedCost: number
  city: string
  objectType: 'apartment' | 'house' | 'office' | 'garage'
  serviceItems: string[]
  status: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as Partial<ApiError>
    throw new Error(data.message || 'Request failed')
  }

  return (await response.json()) as T
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse<{ message: string; order: CreatedOrder }>(response)
}
