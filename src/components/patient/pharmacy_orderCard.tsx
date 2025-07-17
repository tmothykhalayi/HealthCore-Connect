import { useGetPharmacyOrders } from '@/hooks/patients/pharmacy_ordersHook'
import { motion } from 'framer-motion'

type PharmacyOrder = {
  pharmacy_order_id: number
  patient_id: number
  medication_name: string
  dosage: string
  quantity: number
  status: string
  created_at: string
  // Optional medicine details if available
  medicine?: {
    name: string
    price: number
    img?: string
  }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  processing: 'bg-blue-100 text-blue-800',
}

export const PharmacyOrdersList = ({ patientId }: { patientId: number }) => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useGetPharmacyOrders(patientId)

  console.log('Pharmacy Orders:', orders)

  if (isLoading) {
    return <div className="text-center py-8">Loading pharmacy orders...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const arrayOrders = Array.isArray(orders) ? orders : [];
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

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Pharmacy Orders</h1>

      {orders?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {arrayOrders.map((order: PharmacyOrder) => (
            <OrderCard
              key={order.pharmacy_order_id}
              order={order}
              formatDate={formatDate}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

const OrderCard = ({
  order,
  formatDate,
}: {
  order: PharmacyOrder
  formatDate: (date: string) => string
}) => {
  // Animation variants for each card
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
      boxShadow:
        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.2 },
    },
  }

  // Get status color class
  const statusColor =
    statusColors[order.status.toLowerCase()] || 'bg-gray-100 text-gray-800'

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
      variants={cardVariants}
      whileHover="hover"
      initial="hidden"
      animate="show"
    >
      <div className="p-6">
        {/* Order ID and Status */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Order #{order.pharmacy_order_id}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Medicine Info */}
        <div className="mb-4">
          <p className="font-medium text-gray-800">{order.medication_name}</p>
          <p className="text-gray-600 text-sm">Dosage: {order.dosage}</p>
          <p className="text-gray-600 text-sm">Quantity: {order.quantity}</p>
        </div>

        {/* Order Date */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
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
          Ordered: {formatDate(order.created_at)}
        </div>
      </div>
    </motion.div>
  )
}

export default PharmacyOrdersList