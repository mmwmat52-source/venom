import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { Product } from '../types'
import { useCartStore } from '../store'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem(product, 1)
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 animate-fadeIn">
      <Link to={`/products/${product.id}`} className="block h-48 overflow-hidden bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm ml-1">{product.rating} ({product.reviews} reviews)</span>
        </div>

        {/* Price and Stock */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-primary">${product.price}</p>
            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-primary hover:bg-secondary text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
