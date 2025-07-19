import { useState } from 'react'
import { Link } from 'react-router-dom'

import { FaChevronDown } from 'react-icons/fa'

import doctorsData from '../data/doctorsData'

const Doctors = () => {
  const [firstSlice, setFirstSlice] = useState(0)
  const [secondSlice, setSecondSlice] = useState(6)

  const handleSlice = (page: number) => {
    if (firstSlice === 0 && page === 2) {
      setFirstSlice(6)
      setSecondSlice(12)
    } else {
      setFirstSlice(0)
      setSecondSlice(6)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-8 px-4 bg-indigo-950 text-purple-400 lg:px-16 lg:py-20">
        <div className="flex flex-col items-center gap-y-4 mb-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-y-4 mb-8 md:basis-2/4 lg:basis-2/6">
            <h1 className="text-4xl text-balance md:text-5xl">
              Find your{' '}
              <span className="font-playfair-display text-teal-400 italic">
                health
              </span>{' '}
              specialists.
            </h1>

            <p className="text-purple-500">
              We are committed to providing the highest quality healthcare
              services to our patients, ensuring their well-being and comfort
              through advanced medical practices and compassionate care.
            </p>
          </div>

          <img
            src="/assets/images/healthcare-hero.jpg"
            alt="Doctor tending to patient."
            className="max-h-[400px] md:w-[30%] md:max-h-none md:basis-2/6 rounded-xl"
          />
        </div>
      </section>
      Doctors Grid
      <section className="py-8 px-4 text-purple-950 lg:px-16 lg:py-20">
        <h2 className="font-semibold text-4xl text-balance md:text-5xl">
          Qualified{' '}
          <span className="font-playfair-display italic text-purple-400">
            Doctors
          </span>
        </h2>

        <div className="my-8 flex items-center border border-red rounded-2xl overflow-hidden xl:max-w-[50%]">
          <FaChevronDown className="mx-4 cursor-pointer" />
          <input
            type="text"
            placeholder="Search doctor"
            className="mr-auto py-2 pl-2 outline-purple-400 xl:basis-2/3"
          />
          <button className="h-full py-2 px-4 self-end bg-teal-300 font-bold active:bg-teal-200 active:text-purple-800 lg:py-4 lg:px-6">
            Find Doctor
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {...doctorsData.slice(firstSlice, secondSlice).map((doctor) => {
            return (
              <Link to={`/doctors/${doctor.id}`}>
                <div
                  key={doctor.id}
                  className="mb-8 p-2 flex flex-col gap-y-2 bg-purple-100 text-purple-900 rounded-2xl shadow-sm sm:p-4"
                >
                  <img
                    src={doctor.url}
                    alt="Doctor"
                    className="w-full min-w-60 h-64 object-cover object-top rounded-2xl sm:min-w-64"
                  />
                  <h3 className="text-2xl font-bold">Dr.Esthy Ambetsaa</h3>
                  <p className="mb-4">MBBS, MD (Rheumatologist)</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="w-fit mx-auto flex gap-x-1 text-xl font-semibold">
          <button
            onClick={() => handleSlice(1)}
            className={`px-2 border-2 border-purple-200 rounded ${
              firstSlice === 0 ? 'bg-purple-50 cursor-default' : ''
            }`}
          >
            1
          </button>

          <button
            onClick={() => handleSlice(2)}
            className={`px-2 border-2 border-purple-200 rounded ${
              firstSlice === 6 ? 'bg-purple-50 cursor-default' : ''
            }`}
          >
            2
          </button>

          <button
            onClick={() => handleSlice(2)}
            className="px-2 border-2 border-purple-200 rounded"
          >
            &#10095;
          </button>
        </div>
      </section>
    </>
  )
}

export default Doctors
