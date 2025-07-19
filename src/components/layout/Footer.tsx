import { Link } from 'react-router-dom'
import { useToast } from '../utils/toast-context'

const Footer = () => {
  const toast = useToast()

  return (
    <div className="w-full px-4 pt-8 bg-indigo-950 lg:px-12 lg:pt-16">
      <div className="mb-8 flex flex-col justify-between gap-y-8 lg:mb-16 lg:flex-row">
        <div className="flex flex-col gap-y-4 lg:basis-1/4 lg:mr-auto">
          <h1 className="text-3xl font-playfair-display font-medium text-teal-500 cursor-default">
            SrMedical
          </h1>
          <p className="text-lg text-purple-400">
            Your health is our priority. We are committed to providing you with
            the best healthcare services and support.
          </p>
          <div className="flex gap-x-4">
            <input
              type="email"
              placeholder="example@gmail.com"
              className="pl-4 text-purple-400 bg-transparent border border-purple-400 rounded-2xl focus:outline-teal-400 placeholder:text-purple-400"
            />
            <button
              onClick={() =>
                toast?.open('Successfully subscribed to newsletter.')
              }
              className="py-2 px-4 bg-teal-500 text-white rounded-xl md:hover:bg-teal-600 ease-in-out duration-200 active:scale-95"
            >
              Subscribe
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-y-12 text-purple-400 lg:basis-2/4 lg:flex-nowrap lg:justify-between">
          <div className="flex flex-col gap-y-6 [&>*]:w-fit">
            <span className="text-2xl font-semibold">Menu</span>
            <Link to="/" className="lg:hover:text-teal-400">
              Home
            </Link>
            <Link to="/about" className="lg:hover:text-teal-400">
              About
            </Link>
            <Link to="/services" className="lg:hover:text-teal-400">
              Service
            </Link>
            <Link to="/doctors" className="lg:hover:text-teal-400">
              Partner Team
            </Link>
          </div>
          <div className="flex flex-col gap-y-6 [&>*]:w-fit">
            <span className="text-2xl font-semibold">Legal</span>
            <a href="#" className="lg:hover:text-teal-400">
              Privacy Policy
            </a>
            <a href="#" className="lg:hover:text-teal-400">
              Terms & Conditions
            </a>
            <a href="#" className="lg:hover:text-teal-400">
              Service
            </a>
            <a href="#" className="lg:hover:text-teal-400">
              Blog Post
            </a>
          </div>
          <div className="flex flex-col gap-y-6 font-medium [&>*]:w-fit">
            <span className="text-2xl font-semibold">Contact</span>
            <p>
              2115 Thornridge Cir. Syracuse, <br />
              Connecticut 36421
            </p>
            <p>timothykhalayi@gmail.com</p>
            <p>+254959786062</p>
          </div>
        </div>
      </div>

      <p className="py-4 text-xl text-purple-400 [&>a]:text-teal-400 border-t border-teal-700">
        Images sourced from{' '}
        <a href="//www.freepik.com" target="_blank" className="hover:underline">
          Freepik
        </a>{' '}
        and{' '}
        <a
          href="//www.unsplash.com"
          target="_blank"
          className="hover:underline"
        >
          Unsplash
        </a>
        .
      </p>
    </div>
  )
}

export default Footer
