import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { getUserIdHelper, getAccessTokenHelper } from '@/lib/auth'
import { useGetPatientById, useUpdatePatient, useGetPatientByUserId } from '@/hooks/patient'
import { useGetCurrentUserProfile } from '@/hooks/user'
import { API_BASE_URL } from '@/api/BaseUrl'
import type { patient } from '@/api/patient'

export const Route = createFileRoute('/Dashboard/patient/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const currentUserId = Number(getUserIdHelper())
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)

  // Get current user's profile with role-specific data
  const { data: userProfileData, isLoading: isLoadingUserProfile } = useGetCurrentUserProfile()
  
  // Extract patient data from user profile
  const patientData = userProfileData?.data?.profile
  const userData = userProfileData?.data
  const userId = userData?.id
  
  // Try to get patient ID from profile, if not found, use fallback method
  const patientId = patientData?.id
  
  // Fallback: Get patient by user ID if patient data is not in profile
  const { data: fallbackPatientData, isLoading: isLoadingFallback } = useGetPatientByUserId(userId || 0)
  
  // Use fallback data if profile doesn't have patient data
  const finalPatientData = patientData || fallbackPatientData
  const finalPatientId = patientId || fallbackPatientData?.id || currentUserId

  console.log('=== DEBUG INFO ===')
  console.log('User Profile Data:', userProfileData)
  console.log('Patient Data from Profile:', patientData)
  console.log('User Data:', userData)
  console.log('User ID:', userId)
  console.log('Patient ID from Profile:', patientId)
  console.log('Fallback Patient Data:', fallbackPatientData)
  console.log('Fallback Patient ID:', fallbackPatientData?.id)
  console.log('Final Patient Data:', finalPatientData)
  console.log('Final Patient ID:', finalPatientId)
  console.log('Current User ID from auth:', currentUserId)
  console.log('==================')

  const updatePatientMutation = useUpdatePatient()

  // Define the type for the API response that includes user relation
  type PatientWithUser = patient & {
    user?: {
      id: number
      firstName: string
      lastName: string
      email: string
    }
  }

  // Initialize profile data with real data from API
  const [profileData, setProfileData] = useState<Partial<patient>>({
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: [],
    bloodType: '',
  })

  // Update profile data when API data is loaded
  useEffect(() => {
    if (finalPatientData) {
      setProfileData({
        phoneNumber: finalPatientData.phoneNumber || '',
        dateOfBirth: finalPatientData.dateOfBirth || '',
        address: finalPatientData.address || '',
        emergencyContact: finalPatientData.emergencyContact || '',
        medicalHistory: finalPatientData.medicalHistory || '',
        allergies: finalPatientData.allergies || [],
        bloodType: finalPatientData.bloodType || '',
      })
    }
  }, [finalPatientData])

  // Cast patientData to include user relation
  const patientWithUser = patientData as PatientWithUser | undefined

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    prescriptionUpdates: true,
    orderStatusUpdates: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    shareMedicalHistory: false,
    allowResearchParticipation: false,
    shareWithPharmacy: true,
    shareWithDoctors: true,
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    console.log('Updating profile with patientId:', finalPatientId)
    console.log('Profile data:', profileData)
    
    if (!finalPatientId) {
      alert('Patient ID not found. Please try again.')
      setIsLoading(false)
      return
    }
    

    
    try {
      const result = await updatePatientMutation.mutateAsync({
        patientId: finalPatientId,
        patientData: profileData
      })
      
      console.log('Update result:', result)
      
      // Show success message
      alert('Profile updated successfully!')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      const errorMessage = error?.message || 'Failed to update profile. Please try again.'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'security', label: 'Security', icon: '🛡️' },
  ]

  if (isLoadingUserProfile || isLoadingFallback) {
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

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={userData?.firstName || ''}
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
                        value={userData?.lastName || ''}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Contact admin to change name</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userData?.email || ''}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Contact admin to change email</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={profileData.gender || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value as any }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        value={profileData.emergencyContact}
                        onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Type
                      </label>
                      <select
                        value={profileData.bloodType}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bloodType: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <input
                      type="text"
                      value={profileData.allergies?.join(', ') || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, allergies: e.target.value.split(', ') }))}
                      placeholder="Enter allergies separated by commas"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical History
                    </label>
                    <textarea
                      value={profileData.medicalHistory}
                      onChange={(e) => setProfileData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                      rows={4}
                      placeholder="Enter your medical history"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || updatePatientMutation.isPending}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading || updatePatientMutation.isPending ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Receive notifications about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key as keyof typeof notificationSettings)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  {Object.entries(privacySettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Allow sharing of your {key.replace(/([A-Z])/g, ' $1').toLowerCase()} with healthcare providers
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyToggle(key as keyof typeof privacySettings)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Change Password</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Update your password to keep your account secure
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Change Password
                    </button>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Login History</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      View recent login activity on your account
                    </p>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                      View History
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 