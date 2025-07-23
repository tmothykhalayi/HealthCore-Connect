import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCreatePharmacyOrder } from '@/hooks/patient/order'
import { useToast } from '@/components/utils/toast-context'
import { useGetPatientByUserId } from '@/hooks/patient'
import { getUserIdHelper } from '@/lib/auth'
import { useGetPharmacies } from '@/hooks/pharmacyhooks'

type Medicine = {
  medicine_id: number
  name: string
  price: number
}

type OrderMedicineModalProps = {
  medicine: Medicine
  patientId: number
  onClose: () => void
  onSuccess: (orderData: any) => void
}

const OrderMedicineModal = ({
  medicine,
  patientId: _unusedPatientId, // ignore prop, fetch real patientId
  onClose,
  onSuccess,
}: OrderMedicineModalProps) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()
  const userId = Number(getUserIdHelper())
  const { data: patient, isLoading: loadingPatient, isError: errorPatient } = useGetPatientByUserId(userId)
  const { data: pharmacies, isLoading: loadingPharmacies, isError: errorPharmacies } = useGetPharmacies()
  const createOrderMutation = useCreatePharmacyOrder()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    if (!patient || !patient.id) {
      setError('Patient profile not found. Please complete your profile or contact support.')
      setIsSubmitting(false)
      return
    }
    if (!selectedPharmacyId) {
      setError('Please select a pharmacy.')
      setIsSubmitting(false)
      return
    }
    try {
      const orderData = {
        patientId: patient.id, // use real patient id
        pharmacyId: selectedPharmacyId, // use selected pharmacy
        medicineId: medicine.medicine_id,
        quantity,
        orderDate: new Date().toISOString(),
        status: 'pending',
        totalAmount: medicine.price * quantity,
        OrderId: `ORD-${Date.now()}`,
      }

      const result = await createOrderMutation.mutateAsync(orderData)
      if (toast) toast.open('Order placed successfully!')
      onSuccess(result)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  }

  if (loadingPatient || loadingPharmacies) {
    return <div className="p-6 text-center">Loading patient and pharmacy info...</div>
  }
  if (errorPatient || errorPharmacies) {
    return <div className="p-6 text-center text-red-500">Error loading patient or pharmacy info.</div>
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Order {medicine.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Pharmacy selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Pharmacy
              </label>
              <select
                className="w-full border rounded p-2"
                value={selectedPharmacyId}
                onChange={e => setSelectedPharmacyId(e.target.value)}
                required
              >
                <option value="">-- Select a pharmacy --</option>
                {Array.isArray(pharmacies) && pharmacies.map((pharmacy: any) => (
                  <option key={pharmacy.id || pharmacy.pharmacy_id} value={pharmacy.id || pharmacy.pharmacy_id}>
                    {pharmacy.name || pharmacy.pharmacy_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-lg font-semibold">
                Total: Ksh {(medicine.price * quantity).toFixed(2)}
              </p>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default OrderMedicineModal
