import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { getUserIdHelper } from '@/lib/auth'
import { getDoctorByUserIdFn } from '@/API/doctor'
import { updateDoctorFn } from '@/API/doctor'
import { FaUserMd, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaGraduationCap, FaMoneyBillWave, FaClock, FaEdit } from 'react-icons/fa'

export const Route = createFileRoute('/Dashboard/doctor/settings')({
  component: DoctorSettingsPage,
})

function DoctorSettingsPage() {
  const userId = getUserIdHelper()
  const [doctorId, setDoctorId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  
  const [isUpdating, setIsUpdating] = useState(false)
  
  console.log('Settings Component Debug:')
  console.log('userId from getUserIdHelper():', userId)
  console.log('userId type:', typeof userId)
  console.log('Number(userId):', Number(userId))
  
  // Manual fetching approach for better debugging
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  
  // Fetch doctor profile manually
  useEffect(() => {
    async function fetchDoctorProfile() {
      if (userId) {
        try {
          setIsLoading(true)
          setError(null)
          console.log('Fetching doctor profile for userId:', userId)
          
          const doctorProfile = await getDoctorByUserIdFn(Number(userId))
          const doctor = (doctorProfile as any).data ? (doctorProfile as any).data : doctorProfile
          
          console.log('Fetched doctor profile:', doctor)
          setDoctorProfile(doctor)
        } catch (err) {
          console.error('Error fetching doctor profile:', err)
          setError(err)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    
    fetchDoctorProfile()
  }, [userId])

  // Form state
  const [formData, setFormData] = useState({
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: 1, // Start with 1 instead of 0 to pass validation
    education: '',
    phoneNumber: '',
    officeAddress: '',
    consultationFee: 100, // Start with 100 instead of 0 to pass validation
    availableDays: [] as string[],
    availableHours: '',
    bio: '',
    status: 'active'
  })

  // Available days options
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'
  ]

  // Set doctor ID when profile is loaded
  useEffect(() => {
    if (doctorProfile && doctorProfile.id) {
      setDoctorId(doctorProfile.id)
    }
  }, [doctorProfile])

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (doctorProfile && doctorProfile.id) {
      console.log('Loaded doctor profile:', doctorProfile)
      
      const initialFormData = {
        specialization: doctorProfile.specialization || '',
        licenseNumber: doctorProfile.licenseNumber || '',
        yearsOfExperience: Number(doctorProfile.yearsOfExperience) || 1,
        education: doctorProfile.education || '',
        phoneNumber: doctorProfile.phoneNumber || '',
        officeAddress: doctorProfile.officeAddress || '',
        consultationFee: Number(doctorProfile.consultationFee) || 100,
        availableDays: doctorProfile.availableDays || [],
        availableHours: doctorProfile.availableHours || '',
        bio: doctorProfile.bio || '',
        status: doctorProfile.status || 'active'
      }
      
      console.log('Setting initial form data:', initialFormData)
      setFormData(initialFormData)
    }
  }, [doctorProfile])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!doctorId) {
      setMessage('Doctor ID not found. Please try again.')
      return
    }

    // Validate required fields
    if (!formData.specialization.trim()) {
      setMessage('Specialization is required.')
      return
    }

    if (!formData.licenseNumber.trim()) {
      setMessage('License number is required.')
      return
    }

    if (formData.yearsOfExperience < 1) {
      setMessage('Years of experience must be at least 1.')
      return
    }

    if (formData.consultationFee <= 0) {
      setMessage('Consultation fee must be greater than 0.')
      return
    }

    // Try a minimal update first - just update one field to test
    const testData = {
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      yearsOfExperience: formData.yearsOfExperience,
      education: formData.education,
      phoneNumber: formData.phoneNumber,
      officeAddress: formData.officeAddress,
      consultationFee: formData.consultationFee,
      availableDays: formData.availableDays,
      availableHours: formData.availableHours,
      bio: formData.bio,
      status: formData.status
    }

    console.log('Testing minimal update with data:', testData)
    console.log('Doctor ID being used:', doctorId)

    try {
      setIsUpdating(true)
      console.log('Calling updateDoctorFn directly with:', { doctorId, doctorData: testData })
      
      // Use direct API call instead of React Query mutation
      console.log('About to call updateDoctorFn with doctorId:', doctorId, 'and data:', testData)
      const result = await updateDoctorFn(doctorId, testData)
      
      console.log('Update completed successfully:', result)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
      
      // Test: Fetch the doctor data immediately to see if it was saved
      try {
        console.log('Testing immediate fetch after update...')
        const testFetch = await getDoctorByUserIdFn(Number(userId))
        const testDoctor = (testFetch as any).data ? (testFetch as any).data : testFetch
        console.log('Immediate fetch result:', testDoctor)
        console.log('Original specialization:', doctorProfile?.specialization)
        console.log('Updated specialization:', testDoctor?.specialization)
        console.log('Data was saved:', testDoctor?.specialization === formData.specialization)
      } catch (testError) {
        console.error('Error in immediate fetch test:', testError)
      }
      
      // Refresh the profile data after successful update
      try {
        console.log('Refreshing profile data...')
        const updatedProfile = await getDoctorByUserIdFn(Number(userId))
        const updatedDoctor = (updatedProfile as any).data ? (updatedProfile as any).data : updatedProfile
        setDoctorProfile(updatedDoctor)
        console.log('Refreshed doctor profile after update:', updatedDoctor)
      } catch (refreshError) {
        console.error('Error refreshing profile after update:', refreshError)
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        status: error?.status
      })
      setMessage(error?.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUserMd /> },
    { id: 'availability', label: 'Availability', icon: <FaCalendarAlt /> },
    { id: 'professional', label: 'Professional', icon: <FaGraduationCap /> },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">Failed to load profile</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaUserMd className="text-blue-600" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={doctorProfile?.firstName || ''}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contact admin to change name</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={doctorProfile?.lastName || ''}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contact admin to change name</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaPhone className="text-gray-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-500" />
                      Office Address
                    </label>
                    <input
                      type="text"
                      value={formData.officeAddress}
                      onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter office address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell patients about yourself and your expertise..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === 'professional' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaGraduationCap className="text-blue-600" />
                  Professional Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Cardiology, Neurology"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number *
                    </label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter license number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.yearsOfExperience}
                      onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 1)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be at least 1 year</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., MBBS, MD, PhD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaMoneyBillWave className="text-gray-500" />
                      Consultation Fee (KES) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={formData.consultationFee}
                      onChange={(e) => handleInputChange('consultationFee', parseFloat(e.target.value) || 100)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100.00"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be greater than 0</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" />
                  Availability & Schedule
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Available Days
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.availableDays.includes(day)}
                            onChange={() => handleDayToggle(day)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaClock className="text-gray-500" />
                      Available Hours
                    </label>
                    <input
                      type="text"
                      value={formData.availableHours}
                      onChange={(e) => handleInputChange('availableHours', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
                >
                  <FaEdit />
                                      {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
