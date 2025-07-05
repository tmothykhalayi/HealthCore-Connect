import React, { useState } from 'react'
import {
  FaUserMd,
  FaPhone,
  FaBars,
  FaTimes,
  FaSearch,
  FaUserCircle,
} from 'react-icons/fa'
import { MdLocalHospital } from 'react-icons/md'
import { Link } from '@tanstack/react-router'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  // Navigation links array
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/about', label: 'About' },
    { path: '/registration', label: 'Registration' },
  ]

  const utilityLinks = [
    { path: '/portal', label: 'Patient Portal' },
    { path: '/contact', label: 'Contact Us' },
  ]

  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaPhone className="mr-2" />
              <span className="text-sm font-medium">
                Emergency: (123) 456-7890
              </span>
            </div>
            <div className="hidden md:flex items-center">
              <FaUserMd className="mr-2" />
              <Link
                to="/doctors"
                className="text-sm font-medium hover:underline"
              >
                Find a Doctor
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {utilityLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

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
              <Link
                to="/login"
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <FaUserCircle className="mr-2" />
                <span>Login</span>
              </Link>
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
              <Link
                to="/login"
                className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mt-2"
                onClick={toggleMenu}
              >
                <FaUserCircle className="mr-2" />
                <span>Login</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
