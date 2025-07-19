import {
  FaBrain,
  FaHeart,
  FaStethoscope,
  FaTooth,
  FaVial,
} from 'react-icons/fa'
import {
  GiFemale,
  GiKidneys,
  GiLoveInjection,
  GiNightSleep,
} from 'react-icons/gi'

const services = [
  { id: 1, icon: <FaVial />, name: 'Lab Tests' },
  { id: 2, icon: <FaHeart />, name: 'Heart Diseases' },
  { id: 3, icon: <FaTooth />, name: 'Dental' },
  { id: 4, icon: <GiNightSleep />, name: 'Hypnotherapy' },
  { id: 5, icon: <FaBrain />, name: 'Neurology' },
  { id: 6, icon: <GiKidneys />, name: 'Urology' },
  { id: 7, icon: <FaStethoscope />, name: 'Occupational Medicine' },
  { id: 8, icon: <GiLoveInjection />, name: 'Vaccinations' },
  { id: 9, icon: <GiFemale />, name: "Women's Health" },
]

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-8 px-4 bg-indigo-950 text-purple-400 lg:p-16">
        <div className="flex flex-col items-center gap-y-4 mb-8 md:flex-row">
          <h1 className="text-4xl text-balance mr-auto md:basis-1/3 md:text-5xl">
            Our{' '}
            <span className="font-playfair-display text-teal-400 italic">
              services
            </span>
          </h1>

          <div className="flex flex-col gap-y-4 md:basis-1/3">
            <p className="w-fit lg:text-lg">
              We believe that good health is the foundation for a fulfilling and
              prosperous life, and our mission is to provide reliable
              information, expert guidance and personalized support to help you
              achieve your health goals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-4 [&>*]:object-cover [&>*]:position-center [&>*]:rounded-2xl">
          <img
            src="/assets/images/services-1.jpg"
            alt="Image of pediatrician."
            className="w-2/4 h-52 max-h-[700px] md:h-72 lg:h-[400px]"
          />

          <img
            src="/assets/images/services-2.jpg"
            alt="Doctor with a vaccine."
            className="w-2/4 h-52 max-h-[700px] md:h-72 lg:h-[400px]"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 px-4 text-purple-900 lg:p-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-y-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="px-4 py-8 flex flex-col gap-y-4 bg-purple-100 rounded-xl md:gap-y-6"
            >
              <span className="text-3xl text-teal-500 lg:text-4xl">
                {service.icon}
              </span>
              <h2 className="text-xl font-bold lg:text-2xl">{service.name}</h2>
              <p className="mb-8 font-semibold lg:text-lg">
                These test provide valuable information to healthcare providers
                about a patient's health status and can help guide treatment
                decisions and can help guide treatment decisions.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default About
