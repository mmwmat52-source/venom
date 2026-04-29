import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ArrowLeft, Plus, Minus, Heart } from 'lucide-react'
import { useProductsStore, useCartStore } from '../store'
import { apiClient } from '../services/api'
import { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (id) {
          const data = await apiClient.getProductById(id)
          setProduct(data)
        }
      } catch (error) {
        console.error('Failed to load product:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      alert(`${quantity} x ${product.name} added to cart!`)
    }
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
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

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center space-x-2 text-primary hover:text-secondary mb-8 font-bold"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center h-96">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Category Badge */}
            <span className="inline-block bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="ml-4 text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-5xl font-bold text-primary mb-2">${product.price}</p>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-bold">
                {product.stock > 0 ? (
                  <span className="text-green-600">✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">✗ Out of Stock</span>
                )}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-bold mb-3">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center font-bold focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-primary hover:bg-secondary text-dark font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 rounded-lg border-2 transition ${
                  isFavorite ? 'border-primary bg-primary text-dark' : 'border-gray-300 hover:border-primary'
                }`}
              >
                <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">SKU</p>
                  <p className="font-bold">VENOM-{product.id.slice(0, 6)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Category</p>
                  <p className="font-bold">{product.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
