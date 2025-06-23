import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          address: string
          neighborhood: string
          reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          address: string
          neighborhood: string
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          address?: string
          neighborhood?: string
          reference?: string | null
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          total: number
          status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled"
          payment_method: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          total: number
          status?: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled"
          payment_method: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          total?: number
          status?: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled"
          payment_method?: string
          notes?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
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
        Insert: {
          id?: string
          order_id: string
          product_name: string
          size: string
          price: number
          quantity: number
          complements: string[]
          complements_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_name?: string
          size?: string
          price?: number
          quantity?: number
          complements?: string[]
          complements_price?: number
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          sizes: any
          image_url: string | null
          category: "acai" | "complemento" | "bebida"
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          sizes: any
          image_url?: string | null
          category: "acai" | "complemento" | "bebida"
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          sizes?: any
          image_url?: string | null
          category?: "acai" | "complemento" | "bebida"
          active?: boolean
          updated_at?: string
        }
      }
      complements: {
        Row: {
          id: string
          name: string
          price: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          active?: boolean
          updated_at?: string
        }
      }
    }
  }
}
