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
  baseService: 'regular' | 'deep' | 'post_renovation' | 'office'
  additionalItems: Array<
    | 'sofa_chem_2p'
    | 'chairs_chem'
    | 'carpet_chem_3m'
    | 'mattress_chem_2p'
    | 'bed_chem_2p'
    | 'kitchen_wet_cleaning'
    | 'stove_hood_chem'
    | 'full_premises_chem'
  >
  furnitureCount?: number
  date: string
  time: string
  comment?: string
}

export type CreatedOrder = {
  id: string
  orderNumber: string
  estimatedCost: number
  city: string
  baseService: 'regular' | 'deep' | 'post_renovation' | 'office'
  objectType: 'apartment' | 'house' | 'office' | 'garage'
  additionalItems: string[]
  furnitureCount: number
  pricingBreakdown: {
    basePrice: number
    areaSurcharge: number
    addOnsTotal: number
    currency: 'PLN'
  }
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
