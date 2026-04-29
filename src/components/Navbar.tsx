import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react'
import { useCartStore } from '../store'
import { useAuthStore } from '../store'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCartStore()
  const { user, logout } = useAuthStore()

  const cartCount = items.length
  const isAdmin = user?.role === 'admin'

  return (
    <nav className="fixed top-0 left-0 right-0 bg-dark text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl text-primary hover:text-secondary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">V</div>
            <span>VENOM</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <Link to="/products" className="hover:text-primary transition">Products</Link>
            {isAdmin && <Link to="/admin" className="hover:text-primary transition">Admin</Link>}
          </div>

          {/* Right Items */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Hi, {user.name}</span>
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-2 hover:text-primary transition"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary transition">Login</Link>
                <Link to="/register" className="hover:text-primary transition">Sign Up</Link>
              </>
            )}
            <Link to="/cart" className="relative hover:text-primary transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700 animate-slideIn">
            <Link to="/" className="block py-2 hover:text-primary transition">Home</Link>
            <Link to="/products" className="block py-2 hover:text-primary transition">Products</Link>
            {isAdmin && <Link to="/admin" className="block py-2 hover:text-primary transition">Admin</Link>}
            {user ? (
              <button
                onClick={() => logout()}
                className="block py-2 hover:text-primary transition w-full text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-primary transition">Login</Link>
                <Link to="/register" className="block py-2 hover:text-primary transition">Sign Up</Link>
              </>
            )}
            <Link to="/cart" className="block py-2 hover:text-primary transition">Cart ({cartCount})</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
