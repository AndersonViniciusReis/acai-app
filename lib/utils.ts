import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function generateOrderId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function validateCustomerData(data: any): string[] {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push("Nome é obrigatório")
  }

  if (!data.phone?.trim()) {
    errors.push("Telefone é obrigatório")
  }

  if (!data.address?.trim()) {
    errors.push("Endereço é obrigatório")
  }

  if (!data.neighborhood?.trim()) {
    errors.push("Bairro é obrigatório")
  }

  return errors
}
