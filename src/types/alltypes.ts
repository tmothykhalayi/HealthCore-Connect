// Common base interface
export interface GenericsType {
  id: string
}

// Vehicle interface for vehicle management
export interface Vehicle extends GenericsType {
  name: string
  type: string
  model: string
  year: number
  licensePlate: string
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: Date
  updatedAt: Date
}

// User roles for the health system
export enum UserRole {
  DOCTOR = 'doctor',
  PATIENT = 'patient',
  PHARMACIST = 'pharmacist',
  ADMIN = 'admin',
}

// User entity for the health system
export interface UserTypes extends GenericsType {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: UserRole
  hashedRefreshToken: string
  isVerified: boolean
  provider: string
  providerId: string
  profilePicture: string
  createdAt: Date
  updatedAt: Date
  walletBalance: number

  // Role-specific profiles
  doctorProfile?: DoctorProfile
  patientProfile?: PatientProfile
  pharmacyProfile?: PharmacyProfile
  adminProfile?: AdminProfile

  // Relations
  appointments: Array<Appointment>
  prescriptions: Array<Prescription>
  medicalRecords: Array<MedicalRecord>
  transactions: Array<Transaction>
  notifications: Array<Notification>
  supportTickets: Array<SupportTicket>
  devices: Array<Device>
}

// Doctor profile
export interface DoctorProfile extends GenericsType {
  specialization: string
  licenseNumber: string
  yearsOfExperience: number
  bio: string
  availableSlots: Array<TimeSlot>
}

// Patient profile
export interface PatientProfile extends GenericsType {
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other'
  bloodType: string
  emergencyContact: string
}

// Pharmacy profile
export interface PharmacyProfile extends GenericsType {
  licenseId: string
  address: string
  contactPerson: string
}

// Admin profile
export interface AdminProfile extends GenericsType {
  accessLevel: string
}

// Appointment data
export interface Appointment extends GenericsType {
  doctorId: string
  patientId: string
  scheduledAt: Date
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

// Prescription data
export interface Prescription extends GenericsType {
  doctorId: string
  patientId: string
  issuedAt: Date
  medications: Array<Medication>
  notes: string
}

// Medication details
export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

// Medical records
export interface MedicalRecord extends GenericsType {
  patientId: string
  description: string
  documents: Array<string> // URLs or IDs of attached files
  recordedAt: Date
}

// Transactions for payments or purchases
export interface Transaction extends GenericsType {
  amount: number
  type: 'credit' | 'debit'
  reference: string
  createdAt: Date
}

// Device information for notifications
export interface Device extends GenericsType {
  deviceId: string
  platform: 'ios' | 'android' | 'web'
  pushToken: string
}

// Notification info
export interface Notification extends GenericsType {
  title: string
  message: string
  read: boolean
  sentAt: Date
}

// Support ticket
export interface SupportTicket extends GenericsType {
  subject: string
  message: string
  status: 'open' | 'resolved' | 'closed'
  createdAt: Date
}

// Available time slot for doctor appointments
export interface TimeSlot {
  day: string // e.g. 'Monday'
  from: string // e.g. '09:00'
  to: string // e.g. '12:00'
}

// Login-related interfaces
export interface LoginPayload {
  email: string
  phone?: string
  password: string
}

export interface LoginResponse {
  isVerified?: boolean
  accessToken: string
  refreshToken: string
  user?: {
    id: string
    email: string
    phone?: string
    role?: UserRole
  }
}

export interface GlobalDataType {
  isVerified?: boolean
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user: {
    id: string
    email: string
    role: UserRole
  }
}

export interface loginResponse {
  token: {
    accessToken: string
    refreshToken: string
  }
  user: {
    email: string
    role: Role
    user_id: string
  }
}

export interface loginType {
  email: string
  password: string
}

export interface TUser {
  user_id: string | number
  name: string
  email: string
  phone: string
  role: string
}

export type UserRoleString = 'admin' | 'pharmacist' | 'patient' | 'doctor'

export type AuthState = {
  tokens: Tokens | null
  user: UserAuthType | null
  isAuthenticated: boolean
}

export enum Role {
  admin = 'admin',
  pharmacist = 'pharmacist',
  patient = 'patient',
  doctor = 'doctor',
}

export interface UserAuthType {
  user_id: string
  email: string
  role: Role
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}
export type AuthActions = {
  login: (token: Tokens, userData: UserAuthType) => void
  logout: () => void
  updateAccessToken: (newAccessToken: string) => void
  updateUser: (updatedUser: Partial<UserAuthType>) => void
  verifyUser: () => void
  reinitialize: () => void
}

export type AuthStoreType = AuthState & AuthActions

export interface TDoctor {
  doctor_id: number
  name: string
  email: string
  specialization: string
  license_number: string
  availability: string
  consultation_fee: number
  appointment_id: number
}

// create user DTO
export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  role: UserRole
}

export interface TPatient {
  patient_id: number
  name: string
  email: string
  dob: string
  gender: string
  phone: string
  address: string
}

export interface TAppointment {
  appointment_id: number
  patient_id: number
  doctor_id: number
  patient_name?: string
  doctor_name?: string
  appointment_time: string
  appointment_date?: string
  appointment_time_slot?: string
  status: string
  reason: string
  notes?: string
  priority?: string
  duration?: number
  created_at: string
  // Zoom meeting data
  zoomMeetingId?: string
  user_url?: string
  admin_url?: string
}

export interface TPrescription {
  prescription_id: number
  patient_id: number
  doctor_id: number
  appointment_id: number
  notes: string
  created_at: string
}

export interface TPharmacyOrder {
  pharmacy_order_id: number
  patient_id: number
  doctor_id: number
  medicine_id: number
  quantity: number
  status: string
  created_at: string
  patient_name?: string
  doctor_name?: string
  order_id?: string
  total_amount?: number 
}

export interface TMedicine {
  medicine_id: number
  name: string
  description: string
  stock_quantity: number
  price: number
  expiry_date: string
}

export interface TRecord {
  id: number
  patientId: number
  doctorId: number
  appointmentId?: number
  recordType: string
  title: string
  description: string
  diagnosis?: string
  treatment?: string
  medications?: any
  labResults?: any
  vitals?: any
  allergies?: any
  followUpInstructions?: string
  nextAppointmentDate?: string
  priority: string
  status: string
  notes?: string
  attachments?: any
  createdAt: string
  updatedAt: string
  // Relations
  patient?: {
    id: number
    name: string
    email: string
  }
  doctor?: {
    id: number
    name: string
    email: string
    specialization: string
  }
}

export interface CreateRecordData {
  patientId: number
  doctorId: number
  appointmentId?: number
  recordType: string
  title: string
  description: string
  diagnosis?: string
  treatment?: string
  medications?: any
  labResults?: any
  vitals?: any
  allergies?: any
  followUpInstructions?: string
  nextAppointmentDate?: string
  priority?: string
  status?: string
  notes?: string
  attachments?: any
}

export interface UpdateRecordData {
  patientId?: number
  doctorId?: number
  appointmentId?: number
  recordType?: string
  title?: string
  description?: string
  diagnosis?: string
  treatment?: string
  medications?: any
  labResults?: any
  vitals?: any
  allergies?: any
  followUpInstructions?: string
  nextAppointmentDate?: string
  priority?: string
  status?: string
  notes?: string
  attachments?: any
}

export interface TPayment {
  payment_id: number
  appointment_id: number
  patient_id: number
  payment_method: string
  pharmacy_order_id: number
  created_at: string
  amount: number
  status: string
}

export interface Doctor {
  doctor_id: string | number
  name: string
  specialization: string
  email: string
  availability: string
  license_number: string
  consultation_fee?: number
}

export interface TSignIn {
  email: string
  password: string
}

export interface TSignUp {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  role: string
}

export interface TPatientProfile {
  id?: string
  dateOfBirth: string
  bloodType: string
  medicalDocuments: Array<File>
  user?: User
}

export interface TDoctorProfile {
  id?: string
  licenseNumber: string
  yearsOfExperience: number
  hospitalAffiliation: string
  specializations: Array<string>
  consultationFee: number
  availableDays: Array<string>
  workingHours: string
  professionalBio: string
  availabilityStatus: boolean
  certifications: Array<File>
  user?: User
}

export interface TPharmacistProfile {
  id?: string
  pharmacyName: string
  licenceNumber: string
  user?: User
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  userRole: string
}

export interface TSignIn {
  email: string
  password: string
}

export interface TSignUp {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  role: string
}

export interface TPatientProfile {
  id?: string
  dateOfBirth: string
  bloodType: string
  medicalDocuments: Array<File>
  user?: User
}

export interface TDoctorProfile {
  id?: string
  licenseNumber: string
  yearsOfExperience: number
  hospitalAffiliation: string
  specializations: Array<string>
  consultationFee: number
  availableDays: Array<string>
  workingHours: string
  professionalBio: string
  availabilityStatus: boolean
  certifications: Array<File>
  user?: User
}

export interface TPharmacistProfile {
  id?: string
  pharmacyName: string
  licenceNumber: string
  user?: User
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  userRole: string
}

export interface TPharmacist {
  pharmacist_id: number
  name: string
  email: string
  pharmacy_name: string
  license_number: string
  phone_number: string
  status: string
}
