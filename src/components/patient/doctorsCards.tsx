import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion' // Import framer-motion for animations
import { useGetDoctorQuery } from '@/hooks/patient/doctor'
import AppointmentForm from '@/routes/Dashboard/patient/doctors/appointmentsForm.$doctor_id'
import { useState } from 'react'

type Doctor = {
  doctor_id: number
  name: string
  specialization: string
  email: string
  availability: string
  consultation_fee?: number
  img?: string | null
}

const DoctorsList = () => {
  const { data: doctors, isLoading, isError } = useGetDoctorQuery()
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  console.log('Doctors data:', doctors)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading doctors data</p>
      </div>
    )
  }

  // Animation variants for the container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Available Doctors ({doctors?.length || 0})
          </h2>
          <p className="text-sm text-gray-600">
            Browse and book appointments with our specialists
          </p>
        </div>
      </div>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {doctors?.map((doctor: Doctor, index: number) => (
          <DoctorCard key={doctor.doctor_id} doctor={doctor} index={index} onBook={() => { setSelectedDoctor(doctor); setShowModal(true); }} />
        ))}
      </motion.div>
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Doctor Info at top of modal */}
            <div className="flex items-center mb-4">
              <div>
                <div className="font-bold text-lg text-gray-800">{selectedDoctor.name}</div>
                <div className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-semibold mt-1">{selectedDoctor.specialization}</div>
                <div className="text-gray-500 text-sm">{selectedDoctor.email}</div>
              </div>
            </div>
            <AppointmentForm doctorId={selectedDoctor.doctor_id} onSuccess={() => setShowModal(false)} doctor={selectedDoctor} />
          </div>
        </div>
      )}
    </div>
  )
}

const DoctorCard = ({ doctor, index, onBook }: { doctor: Doctor; index: number; onBook: () => void }) => {
  const imageUrl =
    doctor.img ||
    'https://i.pinimg.com/736x/8e/5b/6a/8e5b6a2191656c1ac5d4571577870170.jpg'
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  }
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      variants={cardVariants}
      whileHover="hover"
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.1 }}
    >
      <div className="p-6">
        <motion.h2
          className="text-xl font-semibold text-gray-800 mb-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {doctor.name}
        </motion.h2>
        {/* Specialty Badge */}
        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-semibold mb-2">
          {doctor.specialization}
        </span>
        <div className="mt-4 space-y-2 text-gray-600">
          <motion.p
            className="flex items-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <svg
              className="w-5 h-5 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            {doctor.email}
          </motion.p>
          <motion.p
            className="flex items-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.55 }}
          >
            <svg
              className="w-5 h-5 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            {doctor.availability}
          </motion.p>
        </div>
        <motion.div
          className="mt-6 flex justify-between items-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.6 }}
        >
          {/* Only show the Book Appointment button */}
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <button
              className="px-6 py-2 bg-blue-700 text-white rounded-lg font-bold text-base shadow hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              onClick={onBook}
            >
              Book Appointment
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default DoctorsList
