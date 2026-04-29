import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCartStore, useProductsStore } from '../store'
import { useState, useEffect } from 'react'
import { apiClient } from '../services/api'

export default function Cart() {
  const { items, total, removeItem, updateQuantity, calculateTotal } = useCartStore()
  const { products } = useProductsStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiClient.getProducts()
        calculateTotal()
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const getProductDetails = (productId: string) => {
    return products.find((p) => p.id === productId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-primary hover:bg-secondary text-dark font-bold py-3 px-8 rounded-lg transition"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = getProductDetails(item.productId)
                if (!product) return null

                return (
                  <div
                    key={item.productId}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <p className="text-primary font-bold text-lg">${item.price}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={18} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center font-bold focus:outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-center min-w-24">
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-bold">${total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-bold">{total > 50 ? 'FREE' : '$10.00'}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax (10%)</p>
                  <p className="font-bold">${(total * 0.1).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-xl font-bold">
                <p>Total</p>
                <p className="text-primary text-2xl">${(total * 1.1 + (total > 50 ? 0 : 10)).toFixed(2)}</p>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-primary hover:bg-secondary text-dark font-bold py-3 px-6 rounded-lg text-center transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-dark font-bold py-3 px-6 rounded-lg text-center mt-4 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
