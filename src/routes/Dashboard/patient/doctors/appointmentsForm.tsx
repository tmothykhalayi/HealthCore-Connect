import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/patient/doctors/appointmentsForm',
)({
  component: AppointmentForm,
})
import { useState } from 'react';
import { usePostAppointmentFormHook } from '@/hooks/patients/appointmentFormHook'; // Update the import path

function AppointmentForm () {
  const { mutate: submitAppointment, isPending, isError, isSuccess } = usePostAppointmentFormHook();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    appointmentDate: '',
    appointmentType: 'initial' // default to initial appointment
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? (e.target as HTMLInputElement).value : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAppointment(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>
      
      {isError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error submitting appointment. Please try again.
        </div>
      )}
      
      {isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Appointment booked successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
            Appointment Date
          </label>
          <input
            type="datetime-local"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</span>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="initial"
                name="appointmentType"
                value="initial"
                checked={formData.appointmentType === 'initial'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="initial" className="ml-2 block text-sm text-gray-700">
                Initial Appointment
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="followUp"
                name="appointmentType"
                value="followUp"
                checked={formData.appointmentType === 'followUp'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="followUp" className="ml-2 block text-sm text-gray-700">
                Follow Up Appointment
              </label>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isPending ? 'Submitting...' : 'Submit Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;