import { IoArrowForward, IoStar } from 'react-icons/io5'
import { useToast } from './utils/toast-context'
import { useState } from 'react'

const patients = [
  { name: 'John Doe', url: '/assets/images/reviews/patient-1.jpg' },
  { name: 'Jenny keziah', url: '/assets/images/reviews/patient-2.jpg' },
  { name: 'Leslie martin', url: '/assets/images/reviews/patient-3.jpg' },
]

const Contact = () => {
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    supportCategory: '',
    urgency: '',
    issueDescription: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['name', 'surname', 'email', 'phone', 'supportCategory', 'urgency', 'issueDescription']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast?.open('Please fill in all required fields.')
      return
    }

    // Here you would typically send the data to your backend
    console.log('Support request submitted:', formData)
    
    // Show success message
    toast?.open('Support request submitted successfully. We will get back to you within 24 hours.')
    
    // Reset form
    setFormData({
      name: '',
      surname: '',
      email: '',
      phone: '',
      supportCategory: '',
      urgency: '',
      issueDescription: ''
    })
  }

  return (
    <>
      {/* Support Request Form Section */}
      <section className="py-8 px-4 text-purple-900 text-center lg:px-16 lg:py-20">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 lg:flex-row">
          <div className="w-full grid grid-cols-1 gap-2 lg:w-2/4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="w-fit text-lg text-purple-950 font-bold"
              >
                First Name*
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Eg.: William"
                className="mb-2 p-2 border border-purple-950 rounded-xl focus:outline-teal-400 placeholder:text-purple-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="surname"
                className="w-fit text-lg text-purple-950 font-bold"
              >
                Last Name*
              </label>
              <input
                required
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                placeholder="Eg.: Smith"
                className="mb-2 p-2 border border-purple-950 rounded-xl focus:outline-teal-400 placeholder:text-purple-400"
              />
            </div>

            <div className="flex flex-col gap-2 lg:col-span-2">
              <label
                htmlFor="email"
                className="w-fit text-lg text-purple-950 font-bold"
              >
                Email*
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Eg.: william.smith@example.com"
                className="mb-2 p-2 border border-purple-950 rounded-xl focus:outline-teal-400 placeholder:text-purple-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="w-fit text-lg text-purple-950 font-bold"
              >
                Phone*
              </label>
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Eg.: +1234567890"
                className="mb-2 p-2 border border-purple-950 rounded-xl focus:outline-teal-400 placeholder:text-purple-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="supportCategory"
                className="w-fit text-lg text-purple-950 font-bold"
              >
                Support Category*
              </label>
              <select
                required
                name="supportCategory"
                value={formData.supportCategory}
                onChange={handleInputChange}
                className="mb-2 p-2 border border-purple-950 rounded-xl focus:outline-teal-400 text-purple-900"
              >
                <option value="">Select Category</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing & Payments</option>
                <option value="appointment">Appointment Issues</option>
                <option value="pharmacy">Pharmacy Services</option>
                <option value="telemedicine">Telemedicine Support</option>
                <option value="account">Account Issues</option>
                <option value="general">General Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 lg:col-span-2">
              <label
                htmlFor="urgency"
                className="w-fit text-lg text-purple-950 font-bold"
              >
                Urgency Level*
              </label>
              <select
                required
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="mb-2 p-2 border border-purple-950 rounded-xl focus:outline-teal-400 text-purple-900"
              >
                <option value="">Select Urgency</option>
                <option value="low">Low - General Question</option>
                <option value="medium">Medium - Need Help Soon</option>
                <option value="high">High - Urgent Issue</option>
                <option value="critical">Critical - System Down</option>
              </select>
            </div>

            <div className="mb-8 flex flex-col gap-2 lg:col-span-2">
              <label
                htmlFor="issueDescription"
                className="w-fit text-lg text-purple-950 font-bold"
              >
                Issue Description*
              </label>
              <textarea
                required
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleInputChange}
                placeholder="Please describe your issue or request in detail..."
                rows={6}
                className="p-2 border border-purple-950 rounded-xl focus:outline-teal-400 placeholder:text-purple-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-fit py-4 px-8 flex items-center gap-x-4 text-white text-xl bg-teal-500 rounded-xl lg:hover:bg-teal-600 ease-in-out duration-200 active:scale-95 cursor-pointer"
            >
              Submit Support Request{' '}
              <span className="text-2xl">
                <IoArrowForward />
              </span>
            </button>
          </div>

          <img
            src="/assets/images/appointment-image.jpg"
            alt=""
            className="w-full h-96 object-cover rounded-2xl lg:w-2/4 lg:h-[600px]"
          />
        </form>
      </section>

      {/* Reviews Section */}
      <section className="py-8 px-4 text-purple-900 lg:px-16 lg:py-20">
        <h2 className="mb-16 font-semibold text-4xl text-balance md:text-5xl">
          Our{' '}
          <span className="font-playfair-display italic text-purple-400">
            patient's
          </span>{' '}
          feedback
        </h2>

        <div className="w-full flex flex-col gap-4 lg:flex-row">
          {patients.map((patient) => (
            <div key={patient.name} className="p-4 flex flex-col gap-y-4 bg-purple-100 font-semibold text-lg rounded-xl lg:gap-y-6">
              {/* Profile pic // Name // Rating */}
              <div className="flex items-center gap-x-6">
                <img
                  src={patient.url}
                  alt={`${patient.name}'s profile picture`}
                  className="h-16 w-16 object-cover rounded-full shadow-md"
                />

                <div className="flex flex-col gap-y-2 font-semibold text-xl lg:text-2xl">
                  <p>{patient.name}</p>

                  <span className="flex gap-x-1">
                    <IoStar /> <IoStar /> <IoStar /> <IoStar /> <IoStar />
                  </span>
                </div>
              </div>

              {/* Review */}
              <p>
                "I had an amazing experience with the healthcare team. The staff
                was incredibly professional and attentive, making me feel
                comfortable throughout my visit. Highly recommend!"
              </p>

              <span className="mb-8">16:08 PM Mar 20 2023</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Contact
