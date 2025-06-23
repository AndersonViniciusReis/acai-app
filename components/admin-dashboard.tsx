"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllOrders, updateOrderStatus, getOrderStats } from "@/lib/database"
import { formatCurrency } from "@/lib/utils"
import { Clock, DollarSign, Package, Users, CheckCircle, XCircle } from "lucide-react"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    loadData()
  }, [selectedStatus])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ordersData, statsData] = await Promise.all([
        getAllOrders(selectedStatus === "all" ? undefined : selectedStatus),
        getOrderStats(),
      ])

      setOrders(ordersData || [])
      setStats(statsData || {})
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      loadData() // Recarregar dados
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      alert("Erro ao atualizar status do pedido")
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      delivering: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendente",
      confirmed: "Confirmado",
      preparing: "Preparando",
      delivering: "Entregando",
      delivered: "Entregue",
      cancelled: "Cancelado",
    }
    return labels[status as keyof typeof labels] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Administrativo</h1>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageOrder)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Pedidos</CardTitle>
            <CardDescription>Visualize e gerencie todos os pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
                <TabsTrigger value="preparing">Preparando</TabsTrigger>
                <TabsTrigger value="delivering">Entregando</TabsTrigger>
                <TabsTrigger value="delivered">Entregues</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString("pt-BR")}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                          <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">Cliente:</h4>
                          <p>{order.customers?.name}</p>
                          <p>{order.customers?.phone}</p>
                          <p>{order.customers?.address}</p>
                          <p>{order.customers?.neighborhood}</p>
                          {order.customers?.reference && (
                            <p className="text-sm text-gray-600">Ref: {order.customers.reference}</p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Itens:</h4>
                          {order.order_items?.map((item: any, index: number) => (
                            <div key={index} className="text-sm mb-1">
                              <span>
                                {item.quantity}x {item.product_name}
                              </span>
                              {item.complements.length > 0 && (
                                <span className="text-gray-600 ml-2">+ {item.complements.join(", ")}</span>
                              )}
                            </div>
                          ))}
                          <p className="text-sm text-gray-600 mt-2">Pagamento: {order.payment_method}</p>
                          {order.notes && <p className="text-sm text-gray-600">Obs: {order.notes}</p>}
                        </div>
                      </div>

                      {order.status !== "delivered" && order.status !== "cancelled" && (
                        <div className="flex space-x-2">
                          {order.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, "confirmed")}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirmar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(order.id, "cancelled")}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                            </>
                          )}
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, "preparing")}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Iniciar Preparo
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, "delivering")}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Enviar para Entrega
                            </Button>
                          )}
                          {order.status === "delivering" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, "delivered")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Marcar como Entregue
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}

                  {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhum pedido encontrado para este filtro.</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
