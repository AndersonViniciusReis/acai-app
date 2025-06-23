import { supabase } from "./supabase"
import type { CartItem, CustomerData } from "./types"

// Funções para gerenciar clientes
export async function createOrUpdateCustomer(customerData: CustomerData) {
  try {
    // Verificar se cliente já existe pelo telefone
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", customerData.phone)
      .single()

    if (existingCustomer) {
      // Atualizar cliente existente
      const { data, error } = await supabase
        .from("customers")
        .update({
          name: customerData.name,
          address: customerData.address,
          neighborhood: customerData.neighborhood,
          reference: customerData.reference || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingCustomer.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Criar novo cliente
      const { data, error } = await supabase
        .from("customers")
        .insert({
          name: customerData.name,
          phone: customerData.phone,
          address: customerData.address,
          neighborhood: customerData.neighborhood,
          reference: customerData.reference || null,
        })
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error("Erro ao criar/atualizar cliente:", error)
    throw error
  }
}

// Função para criar pedido
export async function createOrder(
  customerId: string,
  cart: CartItem[],
  total: number,
  paymentMethod: string,
  notes: string,
) {
  try {
    // Criar o pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        total,
        payment_method: paymentMethod,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Criar os itens do pedido
    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_name: item.name,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      complements: item.complements,
      complements_price: item.complementsPrice,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    return order
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    throw error
  }
}

// Função para buscar produtos
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    throw error
  }
}

// Função para buscar complementos
export async function getComplements() {
  try {
    const { data, error } = await supabase
      .from("complements")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao buscar complementos:", error)
    throw error
  }
}

// Função para buscar pedidos de um cliente
export async function getCustomerOrders(customerId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao buscar pedidos do cliente:", error)
    throw error
  }
}

// Função para buscar todos os pedidos (para admin)
export async function getAllOrders(status?: string) {
  try {
    let query = supabase
      .from("orders")
      .select(`
        *,
        customers (*),
        order_items (*)
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    throw error
  }
}

// Função para atualizar status do pedido
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    throw error
  }
}

// Função para buscar estatísticas
export async function getOrderStats() {
  try {
    const { data: totalOrders, error: totalError } = await supabase.from("orders").select("id", { count: "exact" })

    const { data: todayOrders, error: todayError } = await supabase
      .from("orders")
      .select("id", { count: "exact" })
      .gte("created_at", new Date().toISOString().split("T")[0])

    const { data: revenue, error: revenueError } = await supabase
      .from("orders")
      .select("total")
      .eq("status", "delivered")

    if (totalError || todayError || revenueError) {
      throw totalError || todayError || revenueError
    }

    const totalRevenue = revenue?.reduce((sum, order) => sum + order.total, 0) || 0

    return {
      totalOrders: totalOrders?.length || 0,
      todayOrders: todayOrders?.length || 0,
      totalRevenue,
      averageOrder: totalOrders?.length ? totalRevenue / totalOrders.length : 0,
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    throw error
  }
}
