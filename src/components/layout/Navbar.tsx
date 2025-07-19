import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { IoClose, IoMenu } from 'react-icons/io5'

const Navbar = () => {
  // Mobile menu display logic
  const [displayMenu, setDisplayMenu] = useState(false)

  const handleMenu = () => {
    setDisplayMenu((prev) => !prev)
  }

  return (
    <nav className="relative flex items-center p-4 md:justify-around">
      <NavLink
        to="/"
        className="mr-auto text-3xl font-playfair-display font-medium text-teal-500 md:mr-0"
      >
        SrMedical
      </NavLink>

      <div className="hidden sm:flex gap-x-4 text-lg font-medium text-purple-950 [&>*]:ease-in [&>*]:duration-75">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'text-teal-400' : 'hover:text-teal-400'
          }
        >
          About
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? 'text-teal-400' : 'hover:text-teal-400'
          }
        >
          Services
        </NavLink>

        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            isActive ? 'text-teal-400' : 'hover:text-teal-400'
          }
        >
          Doctors
        </NavLink>

        <NavLink
          to="/blog"
          className={({ isActive }) =>
            isActive ? 'text-teal-400' : 'hover:text-teal-400'
          }
        >
          Blog
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? 'text-teal-400' : 'hover:text-teal-400'
          }
        >
          Contact
        </NavLink>
      </div>

      <Link
        to="/contact"
        className="hidden md:block py-2 px-4 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 ease-in-out duration-200 active:scale-95"
      >
        Schedule Appointment
      </Link>

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
          <Link to="/contact" className="pb-4">
            Contact
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
