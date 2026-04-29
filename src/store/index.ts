import { create } from 'zustand'
import { User, Cart, CartItem, Product } from '../types'

// Auth Store
interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  isLoading: false,
  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  setUser: (user) => set({ user }),
}))

// Cart Store
interface CartState {
  items: CartItem[]
  total: number
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  calculateTotal: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  total: 0,
  addItem: (product, quantity) => {
    const { items } = get()
    const existingItem = items.find((item) => item.productId === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.push({
        productId: product.id,
        quantity,
        price: product.price,
      })
    }

    localStorage.setItem('cart', JSON.stringify(items))
    set({ items })
    get().calculateTotal()
  },
  removeItem: (productId) => {
    const { items } = get()
    const filtered = items.filter((item) => item.productId !== productId)
    localStorage.setItem('cart', JSON.stringify(filtered))
    set({ items: filtered })
    get().calculateTotal()
  },
  updateQuantity: (productId, quantity) => {
    const { items } = get()
    const item = items.find((item) => item.productId === productId)
    if (item) {
      item.quantity = quantity
    }
    localStorage.setItem('cart', JSON.stringify(items))
    set({ items })
    get().calculateTotal()
  },
  clearCart: () => {
    localStorage.removeItem('cart')
    set({ items: [], total: 0 })
  },
  calculateTotal: () => {
    const { items } = get()
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    set({ total })
  },
}))

// Products Store
interface ProductsState {
  products: Product[]
  selectedProduct: Product | null
  isLoading: boolean
  setProducts: (products: Product[]) => void
  setSelectedProduct: (product: Product | null) => void
  setLoading: (loading: boolean) => void
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
