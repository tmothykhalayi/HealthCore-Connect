import { useState } from 'react'
import { FaDna, FaLaptopMedical, FaStethoscope } from 'react-icons/fa'
import { IoArrowForward, IoClose } from 'react-icons/io5'
import { useRouter } from '@tanstack/react-router'

import faqData from './data/faqData'
import doctorsData from './data/doctorsData'
import Contact from './Contact'
import Chat from '@/components/chat'
import Footer from './layout/Footer'

const Landing = () => {
  const router = useRouter()

  // FAQ Section state handling
  const [displayFAQ, setDisplayFAQ] = useState(0)

  const handleFAQ = (id: number) => {
    if (id !== displayFAQ) {
      setDisplayFAQ(id)
    } else if (id === displayFAQ) {
      setDisplayFAQ(0)
    }
  }

  const handleBookAppointment = () => {
    router.navigate({ to: '/login' })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-8 px-4 bg-indigo-950 text-purple-400 lg:p-16">
        <div className="flex flex-col items-center gap-y-4 mb-8 md:flex-row">
          <h1 className="text-4xl text-balance mr-auto md:basis-1/3 md:text-5xl">
            We provide world class{' '}
            <span className="font-playfair-display text-teal-400 italic">
              treatment
            </span>{' '}
            for everyone.
          </h1>

          <div className="flex flex-col gap-y-4 md:basis-1/3">
            <p className="w-fit">
              We are committed to providing the highest quality healthcare
              services to our patients, ensuring their well-being and comfort
              through advanced medical practices and compassionate care.
            </p>

            <button
              onClick={handleBookAppointment}
              className="w-fit py-4 px-8 flex items-center gap-x-4 bg-teal-500 font-medium text-white rounded-2xl lg:hover:bg-teal-600 ease-in-out duration-200 active:scale-95"
            >
              Book Appointment <IoArrowForward className="text-2xl" />
            </button>
          </div>
        </div>

        <img
          src="/assets/images/landing/hero.jpg"
          alt="Scientist at work"
          className="w-full h-4/5 max-h-[700px] object-cover rounded-2xl"
        />
      </section>

      {/* "Core Values" Section (fields of study) */}
      <section className="py-8 px-4 text-purple-900 lg:px-16 lg:py-24">
        <div className="flex flex-col items-center gap-y-4 mb-8 md:flex-row">
          <h2 className="text-4xl font-semibold mr-auto md:basis-1/3 md:text-5xl">
            Our{' '}
            <span className="font-playfair-display text-purple-400 italic">
              Services
            </span>
          </h2>

          <p className="w-fit md:basis-1/3">
            We offer comprehensive healthcare services designed to meet the
            diverse needs of our patients, from preventive care to specialized
            treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="max-w-80 p-8 flex flex-col gap-y-4 bg-emerald-100">
            <div className="w-fit p-4 text-3xl bg-emerald-200 rounded-full">
              <FaDna />
            </div>

            <h3 className="text-xl font-bold">Early Cancer Detection</h3>

            <p>
              Advanced screening and diagnostic services for early cancer
              detection, utilizing cutting-edge technology and expert medical
              professionals to provide comprehensive care and peace of mind.
            </p>
          </div>

          <div className="max-w-80 p-8 flex flex-col gap-y-4 bg-orange-100">
            <div className="w-fit p-4 text-3xl bg-orange-200 rounded-full">
              <FaStethoscope />
            </div>

            <h3 className="text-xl font-bold">Telemedicine Sessions</h3>

            <p>
              Connect with healthcare providers remotely through our secure
              telemedicine platform. Get consultations, prescriptions, and
              follow-up care from the comfort of your home with our qualified
              medical professionals.
            </p>
          </div>

          <div className="max-w-80 p-8 flex flex-col gap-y-4 bg-purple-100">
            <div className="w-fit p-4 text-3xl bg-purple-200 rounded-full">
              <FaLaptopMedical />
            </div>

            <h3 className="text-xl font-bold">Online Pharmacy</h3>

            <p>
              Convenient online pharmacy services with prescription management,
              medication delivery, and expert pharmaceutical consultation. Order
              your medications safely and have them delivered to your doorstep.
            </p>
          </div>

          <div className="max-w-80 p-8 flex flex-col gap-y-4 bg-blue-100">
            <div className="w-fit p-4 text-3xl bg-blue-200 rounded-full">
              <FaStethoscope />
            </div>

            <h3 className="text-xl font-bold">Clinical Neurophysiology</h3>

            <p>
              Specialized neurological testing and diagnostic services for
              comprehensive brain and nervous system evaluation, helping to
              identify and treat neurological conditions effectively.
            </p>
          </div>
        </div>
      </section>

      {/* Health and well-being Section */}
      <section className="py-8 px-4 bg-purple-400 text-purple-900 lg:px-16 lg:py-24">
        <div className="flex flex-col items-center gap-y-4 mb-8 md:flex-row">
          <h3 className="text-2xl font-semibold mr-auto md:basis-2/4 md:text-4xl">
            Finding new ways to improve the{' '}
            <span className="font-playfair-display italic text-purple-50">
              health and well-being
            </span>{' '}
            of people everywhere.
          </h3>

          <div className="flex flex-col gap-y-4 md:basis-1/3">
            <p className="w-fit text-xl">
              We are dedicated to enhancing the health and well-being of
              individuals worldwide through innovative healthcare solutions,
              compassionate care, and a commitment to excellence in every aspect
              of our work.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-2 [&>*]:h-full [&>*]:rounded-xl md:gap-x-6">
          <img
            loading="lazy"
            src="/assets/images/landing/consultation-1.jpg"
            alt="A medical consultation."
          />
          <img
            loading="lazy"
            src="/assets/images/landing/consultation-2.jpg"
            alt="A medical consultation."
          />
          <img
            loading="lazy"
            src="/assets/images/landing/consultation-3.jpg"
            alt="A medical consultation."
          />
        </div>
      </section>

      {/* Doctors Showcase Section */}
      <section className="py-8 px-4 text-purple-900 lg:px-16 lg:py-24">
        <div className="flex flex-col items-center gap-y-4 mb-8 md:flex-row">
          <h4 className="text-4xl font-semibold mr-auto md:basis-1/3">
            Discover our Highly Qualified{' '}
            <span className="font-playfair-display text-purple-400 italic">
              Doctors
            </span>
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctorsData.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 flex flex-col gap-y-2 bg-purple-100 text-center text-purple-900 rounded-2xl"
            >
              <img
                src={doctor.url}
                alt="Doctor"
                className="w-full h-64 object-cover object-top rounded-2xl"
              />
              <h3 className="text-xl font-bold">Dr. Sudeshna Sinha</h3>
              <p className="mb-4">MBBS, MD (Rheumatologist)</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 px-4 bg-cyan-400 text-purple-900 cursor-pointer lg:px-16 lg:py-24">
        <h5 className="text-2xl md:text-4xl font-semibold mb-12">
          Frequently Asked{' '}
          <span className="text-white font-playfair-display italic">
            Questions
          </span>
        </h5>

        <div className="flex flex-col">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="flex flex-wrap gap-y-4 border-b border-purple-900 [&>*]:px-4 [&>*]:select-none"
              onClick={() => handleFAQ(faq.id)}
            >
              <div className="w-full py-4 flex items-center justify-between group">
                <p className="basis-4/5 font-bold cursor-pointer ease-linear duration-150 group-hover:text-purple-500 lg:text-xl">
                  {faq.question}
                </p>
                <span
                  className={`text-4xl ease-in-out duration-300 ${
                    displayFAQ === faq.id ? 'rotate-0' : 'rotate-45'
                  } cursor-pointer`}
                  onClick={() => handleFAQ(faq.id)}
                >
                  <IoClose />
                </span>
              </div>

              <p
                className={`${
                  displayFAQ === faq.id ? 'block' : 'hidden'
                } basis-full pb-4 font-semibold cursor-default animate-slide-in-top`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section">
        <Contact />
      </section>
      <Chat />
      <Footer />
    </>
  )
}

export default Landing
