import axios, { AxiosInstance } from 'axios'
import { Product, Order, User, ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const { data } = await this.client.get<ApiResponse<Product[]>>('/products')
    return data.data || []
  }

  async getProductById(id: string): Promise<Product> {
    const { data } = await this.client.get<ApiResponse<Product>>(`/products/${id}`)
    return data.data!
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const { data } = await this.client.post<ApiResponse<Product>>('/products', product)
    return data.data!
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data } = await this.client.put<ApiResponse<Product>>(`/products/${id}`, product)
    return data.data!
  }

  async deleteProduct(id: string): Promise<void> {
    await this.client.delete(`/products/${id}`)
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const { data } = await this.client.get<ApiResponse<Order[]>>('/orders')
    return data.data || []
  }

  async getOrderById(id: string): Promise<Order> {
    const { data } = await this.client.get<ApiResponse<Order>>(`/orders/${id}`)
    return data.data!
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const { data } = await this.client.post<ApiResponse<Order>>('/orders', order)
    return data.data!
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const { data } = await this.client.patch<ApiResponse<Order>>(`/orders/${id}`, { status })
    return data.data!
  }

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data } = await this.client.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    })
    return data.data!
  }

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const { data } = await this.client.post<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      name,
      email,
      password,
    })
    return data.data!
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout')
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await this.client.get<ApiResponse<User>>('/auth/me')
    return data.data!
  }
}

export const apiClient = new ApiClient()
