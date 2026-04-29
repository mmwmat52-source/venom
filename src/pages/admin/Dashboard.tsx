import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { apiClient } from '../../services/api'
import { ShoppingCart, Package, Users, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login')
      return
    }

    const loadStats = async () => {
      try {
        const [orders, products] = await Promise.all([
          apiClient.getOrders(),
          apiClient.getProducts(),
        ])

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
        const uniqueCustomers = new Set(orders.map((o) => o.userId)).size

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue,
          totalCustomers: uniqueCustomers,
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Total Orders',
                value: stats.totalOrders,
                icon: ShoppingCart,
                color: 'bg-blue-100',
                textColor: 'text-blue-600',
              },
              {
                title: 'Total Products',
                value: stats.totalProducts,
                icon: Package,
                color: 'bg-green-100',
                textColor: 'text-green-600',
              },
              {
                title: 'Total Revenue',
                value: `$${stats.totalRevenue.toFixed(2)}`,
                icon: TrendingUp,
                color: 'bg-yellow-100',
                textColor: 'text-yellow-600',
              },
              {
                title: 'Total Customers',
                value: stats.totalCustomers,
                icon: Users,
                color: 'bg-purple-100',
                textColor: 'text-purple-600',
              },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className={`${stat.color} ${stat.textColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition cursor-pointer"
               onClick={() => navigate('/admin/products')}>
            <Package size={40} className="text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Manage Products</h2>
            <p className="text-gray-600 mb-6">Add, edit, and remove products</p>
            <button className="bg-primary hover:bg-secondary text-dark font-bold py-2 px-6 rounded-lg transition">
              Go to Products
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition cursor-pointer"
               onClick={() => navigate('/admin/orders')}>
            <ShoppingCart size={40} className="text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Manage Orders</h2>
            <p className="text-gray-600 mb-6">View and update order status</p>
            <button className="bg-primary hover:bg-secondary text-dark font-bold py-2 px-6 rounded-lg transition">
              Go to Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
