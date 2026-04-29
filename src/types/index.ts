// User Types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer'
  avatar?: string
  createdAt: string
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  rating: number
  reviews: number
  createdAt: string
}

// Cart Types
export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

// Order Types
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  createdAt: string
  updatedAt: string
}

// Address Types
export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message: string
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}
