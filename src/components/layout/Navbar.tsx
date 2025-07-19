import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import { IoClose, IoMenu } from 'react-icons/io5'

const Navbar = () => {
  // Mobile menu display logic
  const [displayMenu, setDisplayMenu] = useState(false)

  const handleMenu = () => {
    setDisplayMenu((prev) => !prev)
  }

  return (
    <nav className="relative flex items-center p-4 md:justify-around">
      <Link
        to="/"
        className="mr-auto text-3xl font-playfair-display font-medium text-teal-500 md:mr-0"
      >
        SrMedical
      </Link>

      <div className="hidden sm:flex gap-x-4 text-lg font-medium text-purple-950 [&>*]:ease-in [&>*]:duration-75">
        <Link
          to="/about"
          className="hover:text-teal-400"
        >
          About
        </Link>

        <Link
          to="/services"
          className="hover:text-teal-400"
        >
          Services
        </Link>

        <Link
          to="/doctors"
          className="hover:text-teal-400"
        >
          Doctors
        </Link>

        <Link
          to="/blog"
          className="hover:text-teal-400"
        >
          Blog
        </Link>

        <Link
          to="/contact"
          className="hover:text-teal-400"
        >
          Contact
        </Link>
      </div>

      <div className="hidden md:flex gap-x-4 items-center">
        <Link
          to="/login"
          className="py-2 px-4 text-teal-500 border border-teal-500 rounded-2xl hover:bg-teal-500 hover:text-white ease-in-out duration-200"
        >
          Login
        </Link>
        <Link
          to="/registration"
          className="py-2 px-4 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 ease-in-out duration-200 active:scale-95"
        >
          Register
        </Link>
      </div>

      {/* Mobile menu */}
      <div className="text-3xl sm:hidden" onClick={handleMenu}>
        {displayMenu ? <IoClose /> : <IoMenu />}
      </div>

      {displayMenu && (
        <div className="absolute top-full left-0 w-full flex flex-col gap-y-4 bg-white text-lg font-medium text-purple-950 z-10 [&>*]:pt-4 [&>*]:pl-4 [&>*]:border-t md:hidden">
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="border-t pt-4">Login</Link>
          <Link to="/registration" className="pb-4">Register</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
