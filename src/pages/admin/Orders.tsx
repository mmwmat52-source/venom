import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { apiClient } from '../../services/api'
import { Order } from '../../types'
import { Search } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login')
      return
    }

    const loadOrders = async () => {
      try {
        const data = await apiClient.getOrders()
        setOrders(data)
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadOrders()
  }, [user, navigate])

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus)
      const data = await apiClient.getOrders()
      setOrders(data)
      alert('Order status updated successfully')
    } catch (error) {
      console.error('Failed to update order:', error)
      alert('Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.id.includes(searchTerm) ||
      o.status.includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Manage Orders</h1>
          <p className="text-gray-600">View and update order status</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-bold">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm">{order.userId}</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-600">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
