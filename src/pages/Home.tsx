import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck, Award } from 'lucide-react'
import { useProductsStore } from '../store'
import { apiClient } from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const { products, setProducts, isLoading } = useProductsStore()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiClient.getProducts()
        setProducts(data.slice(0, 6))
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }
    loadProducts()
  }, [])

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark to-gray-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-primary">VENOM</span> Store
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover the ultimate collection of premium products with unbeatable prices and world-class service.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/products"
                className="bg-primary hover:bg-secondary text-dark font-bold py-3 px-8 rounded-lg flex items-center space-x-2 transition transform hover:scale-105"
              >
                <span>Shop Now</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/products"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-dark font-bold py-3 px-8 rounded-lg transition"
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-72 h-72 bg-primary rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose VENOM?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Fast Delivery', desc: 'Quick and reliable shipping' },
              { icon: Shield, title: 'Secure Payment', desc: 'Safe transactions guaranteed' },
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Award, title: 'Best Quality', desc: 'Premium products only' },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition animate-fadeIn">
                  <Icon className="text-primary mx-auto mb-4" size={40} />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary hover:text-secondary font-bold flex items-center space-x-2">
              <span>View All</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary py-16 px-4 text-dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8">Subscribe to our newsletter for exclusive offers and latest products</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark"
            />
            <button className="bg-dark hover:bg-gray-800 text-primary font-bold px-8 py-3 rounded-lg transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">VENOM</h3>
              <p className="text-gray-400">Your premium shopping destination</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/" className="hover:text-primary">Careers</Link></li>
                <li><Link to="/" className="hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-primary">Help Center</Link></li>
                <li><Link to="/" className="hover:text-primary">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-primary">Shipping Info</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 VENOM Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
