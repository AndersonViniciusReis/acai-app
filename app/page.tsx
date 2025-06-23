"use client"

import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { ShoppingCart, Plus, Minus, Phone, MapPin, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { createOrUpdateCustomer, createOrder, getProducts, getComplements } from "@/lib/database"

interface AcaiProduct {
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

interface CartItem {
  id: string
  productId: string
  name: string
  size: string
  price: number
  quantity: number
  complements: string[]
  complementsPrice: number
}

interface CustomerData {
  name: string
  phone: string
  address: string
  neighborhood: string
  reference: string
  paymentMethod: string
  notes: string
  id?: string
}

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"
const supabase = createClient(supabaseUrl, supabaseKey)

// Funções para o banco de dados Supabase
/*
const getProducts = async (): Promise<AcaiProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
    if (error) {
      console.error('Erro ao buscar produtos:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

const getComplements = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('complements')
      .select('*')
    if (error) {
      console.error('Erro ao buscar complementos:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Erro ao buscar complementos:', error)
    return []
  }
}

const createOrUpdateCustomer = async (customerData: CustomerData): Promise<{ id: string }> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .upsert(
        {
          name: customerData.name,
          phone: customerData.phone,
          address: customerData.address,
          neighborhood: customerData.neighborhood,
          reference: customerData.reference,
        },
        { onConflict: 'phone' }
      )
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar/atualizar cliente:', error)
      throw error
    }

    return { id: data.id }
  } catch (error) {
    console.error('Erro ao criar/atualizar cliente:', error)
    throw error
  }
}

const createOrder = async (
  customerId: string,
  cart: CartItem[],
  totalPrice: number,
  paymentMethod: string,
  notes: string
): Promise<{ id: string }> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: customerId,
          total_price: totalPrice,
          payment_method: paymentMethod,
          notes: notes,
          items: cart,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar pedido:', error)
      throw error
    }

    return { id: data.id }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    throw error
  }
}
*/
export default function AcaiOrderingSystem() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    address: "",
    neighborhood: "",
    reference: "",
    paymentMethod: "dinheiro",
    notes: "",
  })
  const [selectedProduct, setSelectedProduct] = useState<AcaiProduct | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedComplements, setSelectedComplements] = useState<string[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<AcaiProduct[]>([])
  const [complements, setComplements] = useState<any[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // Carregar dados do Supabase
  useEffect(() => {
    loadProducts()
    loadComplements()
    loadSavedData()
  }, [])

  const loadProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const data = await getProducts()

      // Se conseguiu carregar do Supabase, usar os dados
      if (data && data.length > 0) {
        // Converter dados do Supabase para o formato esperado
        const formattedProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          sizes: product.sizes, // Já vem como JSON do banco
          image: product.image_url || "/placeholder.svg?height=200&width=200",
          category: product.category,
        }))
        setProducts(formattedProducts)
      } else {
        // Fallback para produtos estáticos
        setProducts([
          {
            id: "1",
            name: "Açaí Tradicional",
            description: "Açaí puro e cremoso, direto da Amazônia",
            sizes: [
              { size: "P", price: 8.5, ml: "300ml" },
              { size: "M", price: 12.0, ml: "500ml" },
              { size: "G", price: 16.5, ml: "700ml" },
              { size: "GG", price: 22.0, ml: "1L" },
            ],
            image: "/placeholder.svg?height=200&width=200",
            category: "acai",
          },
          {
            id: "2",
            name: "Açaí Premium",
            description: "Açaí especial com polpa selecionada",
            sizes: [
              { size: "P", price: 10.0, ml: "300ml" },
              { size: "M", price: 14.5, ml: "500ml" },
              { size: "G", price: 19.0, ml: "700ml" },
              { size: "GG", price: 25.0, ml: "1L" },
            ],
            image: "/placeholder.svg?height=200&width=200",
            category: "acai",
          },
          {
            id: "3",
            name: "Açaí Gourmet",
            description: "Nossa receita especial com ingredientes premium",
            sizes: [
              { size: "P", price: 12.0, ml: "300ml" },
              { size: "M", price: 16.5, ml: "500ml" },
              { size: "G", price: 21.0, ml: "700ml" },
              { size: "GG", price: 28.0, ml: "1L" },
            ],
            image: "/placeholder.svg?height=200&width=200",
            category: "acai",
          },
        ])
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      // Fallback para produtos estáticos em caso de erro
      setProducts([
        {
          id: "1",
          name: "Açaí Tradicional",
          description: "Açaí puro e cremoso, direto da Amazônia",
          sizes: [
            { size: "P", price: 8.5, ml: "300ml" },
            { size: "M", price: 12.0, ml: "500ml" },
            { size: "G", price: 16.5, ml: "700ml" },
            { size: "GG", price: 22.0, ml: "1L" },
          ],
          image: "/placeholder.svg?height=200&width=200",
          category: "acai",
        },
        {
          id: "2",
          name: "Açaí Premium",
          description: "Açaí especial com polpa selecionada",
          sizes: [
            { size: "P", price: 10.0, ml: "300ml" },
            { size: "M", price: 14.5, ml: "500ml" },
            { size: "G", price: 19.0, ml: "700ml" },
            { size: "GG", price: 25.0, ml: "1L" },
          ],
          image: "/placeholder.svg?height=200&width=200",
          category: "acai",
        },
        {
          id: "3",
          name: "Açaí Gourmet",
          description: "Nossa receita especial com ingredientes premium",
          sizes: [
            { size: "P", price: 12.0, ml: "300ml" },
            { size: "M", price: 16.5, ml: "500ml" },
            { size: "G", price: 21.0, ml: "700ml" },
            { size: "GG", price: 28.0, ml: "1L" },
          ],
          image: "/placeholder.svg?height=200&width=200",
          category: "acai",
        },
      ])
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const loadComplements = async () => {
    try {
      const data = await getComplements()

      if (data && data.length > 0) {
        setComplements(data)
      } else {
        // Fallback para complementos estáticos
        setComplements([
          { id: "granola", name: "Granola Crocante", price: 2.0 },
          { id: "banana", name: "Banana Fresca", price: 1.5 },
          { id: "morango", name: "Morango", price: 2.5 },
          { id: "leite-condensado", name: "Leite Condensado", price: 1.0 },
          { id: "leite-po", name: "Leite em Pó", price: 1.0 },
          { id: "amendoim", name: "Amendoim", price: 2.0 },
          { id: "castanha", name: "Castanha do Pará", price: 3.0 },
          { id: "coco", name: "Coco Ralado", price: 1.5 },
          { id: "nutella", name: "Nutella", price: 4.0 },
          { id: "paçoca", name: "Paçoca", price: 2.5 },
          { id: "kiwi", name: "Kiwi", price: 2.0 },
          { id: "manga", name: "Manga", price: 2.0 },
        ])
      }
    } catch (error) {
      console.error("Erro ao carregar complementos:", error)
      // Fallback para complementos estáticos
      setComplements([
        { id: "granola", name: "Granola Crocante", price: 2.0 },
        { id: "banana", name: "Banana Fresca", price: 1.5 },
        { id: "morango", name: "Morango", price: 2.5 },
        { id: "leite-condensado", name: "Leite Condensado", price: 1.0 },
        { id: "leite-po", name: "Leite em Pó", price: 1.0 },
        { id: "amendoim", name: "Amendoim", price: 2.0 },
        { id: "castanha", name: "Castanha do Pará", price: 3.0 },
        { id: "coco", name: "Coco Ralado", price: 1.5 },
        { id: "nutella", name: "Nutella", price: 4.0 },
        { id: "paçoca", name: "Paçoca", price: 2.5 },
        { id: "kiwi", name: "Kiwi", price: 2.0 },
        { id: "manga", name: "Manga", price: 2.0 },
      ])
    }
  }

  const loadSavedData = () => {
    // Manter localStorage como backup
    const savedCart = localStorage.getItem("acai-cart")
    const savedCustomer = localStorage.getItem("acai-customer")

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error)
      }
    }
    if (savedCustomer) {
      try {
        setCustomerData(JSON.parse(savedCustomer))
      } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error)
      }
    }
  }

  // Salvar no localStorage (backup)
  useEffect(() => {
    localStorage.setItem("acai-cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem("acai-customer", JSON.stringify(customerData))
  }, [customerData])

  // Resto das funções permanecem iguais até sendOrder
  const addToCart = (product: AcaiProduct, size: string, complements: string[]) => {
    const sizeInfo = product.sizes.find((s) => s.size === size)
    if (!sizeInfo) return

    const complementsTotal = selectedComplements.reduce((total, compId) => {
      const complement = complements.find((c) => c.id === compId)
      return total + (complement ? complement.price : 0)
    }, 0)

    const newItem: CartItem = {
      id: Date.now().toString(),
      productId: product.id,
      name: `${product.name} (${size})`,
      size,
      price: sizeInfo.price,
      quantity: 1,
      complements: selectedComplements,
      complementsPrice: complementsTotal,
    }

    setCart((prev) => [...prev, newItem])
    setSelectedProduct(null)
    setSelectedSize("")
    setSelectedComplements([])
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId))
    } else {
      setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price + item.complementsPrice) * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const formatWhatsAppMessage = () => {
    let message = `🍇 *PEDIDO DE AÇAÍ* 🍇\n\n`
    message += `👤 *Cliente:* ${customerData.name}\n`
    message += `📱 *Telefone:* ${customerData.phone}\n`
    message += `📍 *Endereço:* ${customerData.address}\n`
    message += `🏘️ *Bairro:* ${customerData.neighborhood}\n`
    if (customerData.reference) {
      message += `📌 *Referência:* ${customerData.reference}\n`
    }
    message += `💳 *Pagamento:* ${customerData.paymentMethod}\n\n`

    message += `🛒 *ITENS DO PEDIDO:*\n`
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.quantity}x\n`
      if (item.complements.length > 0) {
        const complementNames = item.complements
          .map((compId) => complements.find((c) => c.id === compId)?.name)
          .filter(Boolean)
          .join(", ")
        message += `   Complementos: ${complementNames}\n`
      }
      message += `   Valor: R$ ${((item.price + item.complementsPrice) * item.quantity).toFixed(2)}\n\n`
    })

    message += `💰 *TOTAL: R$ ${getTotalPrice().toFixed(2)}*\n\n`

    if (customerData.notes) {
      message += `📝 *Observações:* ${customerData.notes}\n\n`
    }

    message += `⏰ Pedido realizado em: ${new Date().toLocaleString("pt-BR")}`

    return encodeURIComponent(message)
  }

  const sendOrder = async () => {
    if (cart.length === 0) {
      alert("Carrinho vazio!")
      return
    }

    if (!customerData.name || !customerData.phone || !customerData.address) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    setIsLoading(true)

    try {
      // Criar/atualizar cliente no Supabase
      const customer = await createOrUpdateCustomer(customerData)

      // Criar pedido no Supabase
      const order = await createOrder(
        customer.id,
        cart,
        getTotalPrice(),
        customerData.paymentMethod,
        customerData.notes,
      )

      // Enviar via WhatsApp
      const message = formatWhatsAppMessage()
      const whatsappNumber = "5511999999999" // Substitua pelo número real
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

      window.open(whatsappUrl, "_blank")

      // Limpar carrinho após envio
      setCart([])
      setIsCheckoutOpen(false)

      alert(`Pedido #${order.id.slice(0, 8)} enviado com sucesso!`)
    } catch (error) {
      console.error("Erro ao enviar pedido:", error)
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍇</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AçaíExpress</h1>
                <p className="text-sm text-gray-600">Açaí fresquinho na sua casa</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>18h-23h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>(11) 99999-9999</span>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">O Melhor Açaí da Região! 🍇</h2>
          <p className="text-lg text-gray-600 mb-6">Açaí fresquinho, cremoso e com os melhores complementos</p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>4.9 (500+ avaliações)</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Entrega grátis acima de R$ 25</span>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Nossos Açaís</h3>

          {isLoadingProducts ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Carregando produtos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {product.sizes.map((size) => (
                        <div key={size.size} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {size.size} ({size.ml})
                          </span>
                          <span className="font-semibold text-purple-600">R$ {size.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Personalizar Pedido
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoadingProducts && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto disponível no momento.</p>
            </div>
          )}
        </section>
      </main>

      {/* Product Customization Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Personalizar {selectedProduct.name}</DialogTitle>
              <DialogDescription>Escolha o tamanho e os complementos para seu açaí</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Size Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Escolha o tamanho:</Label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedProduct.sizes.map((size) => (
                    <Button
                      key={size.size}
                      variant={selectedSize === size.size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size.size)}
                      className="h-auto p-4 flex flex-col items-center"
                    >
                      <span className="font-bold text-lg">{size.size}</span>
                      <span className="text-sm opacity-75">{size.ml}</span>
                      <span className="font-semibold">R$ {size.price.toFixed(2)}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Complements Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Complementos:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {complements.map((complement) => (
                    <Button
                      key={complement.id}
                      variant={selectedComplements.includes(complement.id) ? "default" : "outline"}
                      onClick={() => {
                        setSelectedComplements((prev) =>
                          prev.includes(complement.id)
                            ? prev.filter((id) => id !== complement.id)
                            : [...prev, complement.id],
                        )
                      }}
                      className="h-auto p-3 flex justify-between items-center"
                      size="sm"
                    >
                      <span>{complement.name}</span>
                      <span className="text-xs">+R$ {complement.price.toFixed(2)}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              {selectedSize && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Açaí ({selectedSize}):</span>
                    <span>R$ {selectedProduct.sizes.find((s) => s.size === selectedSize)?.price.toFixed(2)}</span>
                  </div>
                  {selectedComplements.length > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span>Complementos:</span>
                      <span>
                        +R${" "}
                        {selectedComplements
                          .reduce((total, compId) => {
                            const comp = complements.find((c) => c.id === compId)
                            return total + (comp ? comp.price : 0)
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-purple-600">
                      R${" "}
                      {(
                        (selectedProduct.sizes.find((s) => s.size === selectedSize)?.price || 0) +
                        selectedComplements.reduce((total, compId) => {
                          const comp = complements.find((c) => c.id === compId)
                          return total + (comp ? comp.price : 0)
                        }, 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => addToCart(selectedProduct, selectedSize, selectedComplements)}
                disabled={!selectedSize}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seu Carrinho</DialogTitle>
            <DialogDescription>
              {cart.length === 0 ? "Seu carrinho está vazio" : `${getCartItemsCount()} itens no carrinho`}
            </DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <Button onClick={() => setIsCartOpen(false)} className="mt-4">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    {item.complements.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Complementos:{" "}
                        {item.complements
                          .map((compId) => complements.find((c) => c.id === compId)?.name)
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-purple-600">
                      R$ {(item.price + item.complementsPrice).toFixed(2)} cada
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-purple-600">R$ {getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsCartOpen(false)} className="flex-1">
                  Continuar Comprando
                </Button>
                <Button
                  onClick={() => {
                    setIsCartOpen(false)
                    setIsCheckoutOpen(true)
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Finalizar Pedido</DialogTitle>
            <DialogDescription>Preencha seus dados para finalizar o pedido</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço Completo *</Label>
              <Input
                id="address"
                value={customerData.address}
                onChange={(e) => setCustomerData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Rua, número, complemento"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={customerData.neighborhood}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, neighborhood: e.target.value }))}
                  placeholder="Seu bairro"
                />
              </div>
              <div>
                <Label htmlFor="reference">Ponto de Referência</Label>
                <Input
                  id="reference"
                  value={customerData.reference}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, reference: e.target.value }))}
                  placeholder="Ex: Próximo ao mercado"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="payment">Forma de Pagamento</Label>
              <select
                id="payment"
                value={customerData.paymentMethod}
                onChange={(e) => setCustomerData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão (na entrega)</option>
                <option value="pix">PIX</option>
              </select>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={customerData.notes}
                onChange={(e) => setCustomerData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Alguma observação especial?"
                rows={3}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Resumo do Pedido:</h4>
              {cart.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm">
                    {index + 1}. {item.name} x{item.quantity}
                  </span>
                  <span className="text-sm font-semibold">
                    R$ {((item.price + item.complementsPrice) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span className="text-purple-600">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={sendOrder} className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
              <Phone className="w-4 h-4 mr-2" />
              Enviar Pedido via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
