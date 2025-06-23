export interface AcaiProduct {
  id: string
  name: string
  description: string
  sizes: {
    size: string
    price: number
    ml: string
  }[]
  image: string
  category: "acai" | "complemento" | "bebida"
}

export interface CartItem {
  id: string
  productId: string
  name: string
  size: string
  price: number
  quantity: number
  complements: string[]
  complementsPrice: number
}

export interface CustomerData {
  name: string
  phone: string
  address: string
  neighborhood: string
  reference: string
  paymentMethod: string
  notes: string
}

export interface Complement {
  id: string
  name: string
  price: number
  active?: boolean
}

export interface OrderData {
  id: string
  customer: CustomerData
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered"
  createdAt: Date
}

// Novos tipos para Supabase
export interface DatabaseCustomer {
  id: string
  name: string
  phone: string
  address: string
  neighborhood: string
  reference: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseOrder {
  id: string
  customer_id: string
  total: number
  status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled"
  payment_method: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseOrderItem {
  id: string
  order_id: string
  product_name: string
  size: string
  price: number
  quantity: number
  complements: string[]
  complements_price: number
  created_at: string
}

export interface LoadingState {
  products: boolean
  complements: boolean
  order: boolean
}
