import { useEffect, useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { useProductsStore } from '../store'
import { apiClient } from '../services/api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books']

export default function Products() {
  const { products, setProducts, isLoading } = useProductsStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiClient.getProducts()
        setProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600">Discover our amazing collection of premium products</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 bg-primary text-dark font-bold px-4 py-2 rounded-lg hover:bg-secondary transition"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block lg:w-48 flex-shrink-0`}
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} />
                </button>
              </div>

              <h3 className="font-bold text-lg mb-4 hidden lg:block">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? 'bg-primary text-dark font-bold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full"></div>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No products found</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                  }}
                  className="mt-4 text-primary hover:text-secondary font-bold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
