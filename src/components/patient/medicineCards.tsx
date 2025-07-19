import { useState } from 'react'
import { motion } from 'framer-motion'
import OrderMedicineModal from './ordersForm'
import { useGetMedicineQuery } from '@/hooks/patients/medicine'

type Medicine = {
  medicine_id: number
  name: string
  description: string
  stock_quantity: number
  price: number
  expiry_date: string
  img: string | null
}

const MedicinesList = () => {
  const { data: medicines, isLoading, isError, error } = useGetMedicineQuery()

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
        <p className="text-red-500">Error loading medicines: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Medicines</h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {medicines?.map((medicine: Medicine, index: number) => (
          <MedicineCard
            key={medicine.medicine_id}
            medicine={medicine}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  )
}

const MedicineCard = ({
  medicine,
  index,
}: {
  medicine: Medicine
  index: number
}) => {
  const [showOrderModal, setShowOrderModal] = useState(false)
  const patientId = 1 // Replace with actual patient ID from auth context

  const handleOrderSuccess = (orderData: any) => {
    console.log('Order created:', orderData)
    // Handle successful order creation (e.g., show toast notification)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: ['easeOut'],
      },
    },
    hover: {
      y: -5,
      boxShadow:
        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.2 },
    },
  }

  const formattedExpiryDate = new Date(medicine.expiry_date).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  )

  const imageUrl =
    medicine.img || 'https://via.placeholder.com/300x200?text=Medicine'

  return (
    <>
      <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
        variants={cardVariants}
        whileHover="hover"
        initial="hidden"
        animate="show"
        transition={{ delay: index * 0.1 }}
      >
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={medicine.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/300x200?text=Medicine'
            }}
          />
        </div>

        <div className="p-6">
          <motion.h2
            className="text-xl font-bold text-gray-800 mb-2"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {medicine.name}
          </motion.h2>

          <motion.p
            className="text-gray-600 text-sm mb-4 line-clamp-2"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.35 }}
          >
            {medicine.description}
          </motion.p>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <motion.div
              className="flex items-center"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <svg
                className="w-4 h-4 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              {medicine.stock_quantity} in stock
            </motion.div>

            <motion.div
              className="flex items-center"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.45 }}
            >
              <svg
                className="w-4 h-4 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Expires: {formattedExpiryDate}
            </motion.div>
          </div>

          <motion.div
            className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <span className="text-lg font-bold text-blue-600">
              Ksh {medicine.price.toFixed(2)}
            </span>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => setShowOrderModal(true)}
                className={`px-4 py-2 rounded-md text-white ${
                  medicine.stock_quantity > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={medicine.stock_quantity <= 0}
              >
                {medicine.stock_quantity > 0 ? 'Order Now' : 'Out of Stock'}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {showOrderModal && (
        <OrderMedicineModal
          medicine={{
            medicine_id: medicine.medicine_id,
            name: medicine.name,
            price: medicine.price,
          }}
          patientId={patientId}
          onClose={() => setShowOrderModal(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </>
  )
}

export default MedicinesList
