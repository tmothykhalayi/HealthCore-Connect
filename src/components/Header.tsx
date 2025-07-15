import { useState } from 'react'
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa'
import { MdLocalHospital } from 'react-icons/md'
import { Link, useNavigate } from '@tanstack/react-router'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Add login state
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  const handleSignOut = () => {
    setIsLoggedIn(false)
    navigate({ to: '/' }) // Redirect to home page after sign out
  }

  // Navigation links array
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/registration', label: 'Registration' },
  ]

  return (
    <header className="bg-white shadow-md">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <MdLocalHospital className="text-blue-600 text-4xl mr-2" />
            <div>
              <h1 className="text-2xl font-bold text-blue-800">HealthCare</h1>
              <p className="text-xs text-gray-600">
                Compassionate Care For Life
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 font-medium hover:text-blue-600 [&.active]:text-blue-800 [&.active]:font-semibold"
                activeProps={{ className: 'text-blue-800 font-semibold' }}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center space-x-4 ml-4">
              <button
                onClick={toggleSearch}
                className="text-gray-600 hover:text-blue-600"
              >
                <FaSearch />
              </button>
              {isLoggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => setIsLoggedIn(true)} // Simulate login
                >
                  <FaUserCircle className="mr-2" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleSearch} className="text-gray-600">
              <FaSearch />
            </button>
            <button onClick={toggleMenu} className="text-gray-600">
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search services, doctors, locations..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 font-medium py-2 border-b border-gray-100 [&.active]:text-blue-800 [&.active]:font-semibold"
                  activeProps={{ className: 'text-blue-800 font-semibold' }}
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleSignOut()
                    toggleMenu()
                  }}
                  className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition mt-2"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mt-2"
                  onClick={() => {
                    setIsLoggedIn(true)
                    toggleMenu()
                  }}
                >
                  <FaUserCircle className="mr-2" />
                  <span>Login</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header