import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useCartStore, useAuthStore } from '../store'
import { Address } from '../types'
import { apiClient } from '../services/api'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { items, total, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [formData, setFormData] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light px-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="text-primary hover:text-secondary font-bold"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (user) {
        await apiClient.createOrder({
          userId: user.id,
          items,
          total: total * 1.1 + (total > 50 ? 0 : 10),
          status: 'pending',
          shippingAddress: formData,
        })
      }
      clearCart()
      setStep('confirmation')
    } catch (error) {
      console.error('Failed to create order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-primary hover:text-secondary mb-8 font-bold"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {step === 'confirmation' ? (
          // Confirmation Screen
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="font-bold text-lg">#{Date.now()}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/products')}
                className="flex-1 bg-primary hover:bg-secondary text-dark font-bold py-3 px-8 rounded-lg transition"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-dark font-bold py-3 px-8 rounded-lg transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2">
              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Street Address</label>
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">City</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">State</label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Zip Code</label>
                        <input
                          type="text"
                          required
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Country</label>
                        <input
                          type="text"
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-secondary text-dark font-bold py-3 px-8 rounded-lg mt-6 transition"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardData.cardHolder}
                        onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">CVV</label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-secondary text-dark font-bold py-3 px-8 rounded-lg mt-6 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-bold">${total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-bold">{total > 50 ? 'FREE' : '$10.00'}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Tax (10%)</p>
                  <p className="font-bold">${(total * 0.1).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-lg">
                <p>Total</p>
                <p className="text-primary">${(total * 1.1 + (total > 50 ? 0 : 10)).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
