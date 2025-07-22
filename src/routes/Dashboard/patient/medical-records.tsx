import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { PatientMedicalRecordsTable } from '@/components/patient/medicalRecordsTable'
import { getUserIdHelper } from '@/lib/auth'
import { useEffect, useState } from 'react'
import { getPatientByUserIdFn } from '@/api/patient/patient'

export const Route = createFileRoute('/Dashboard/patient/medical-records')({
  component: MedicalRecordsPage,
})

function MedicalRecordsPage() {
  const userId = Number(getUserIdHelper())
  const [patientId, setPatientId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPatient() {
      setLoading(true)
      try {
        if (userId) {
          const patientProfile = await getPatientByUserIdFn(userId)
          setPatientId(patientProfile?.id || null)
        } else {
          setPatientId(null)
        }
      } catch (err) {
        setPatientId(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPatient()
  }, [userId])

  if (loading) {
    return <div className="p-4">Loading medical records...</div>
  }

  if (!patientId) {
    return <div className="p-4 text-red-500">Patient profile not found. Please complete your profile or contact support.</div>
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <PatientMedicalRecordsTable patientId={patientId} />
      </div>
    </DashboardLayout>
  )
} 