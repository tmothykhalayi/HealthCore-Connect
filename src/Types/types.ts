export interface loginResponse {
 token: {
   accessToken: string
   refreshToken: string
 }
 user:{
   email: string
  role: Role,
  user_id: string
 }
 
}

export interface loginType {
  email: string
  password: string
}

export interface TUser {
  user_id: string
  name: string
  email: string
  phone: string
  role: string
  created_at: string
}

export type UserRole = 'admin' | 'pharmacist' | 'patient' | 'doctor'

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
  login: (token: Tokens, userData: UserAuthType) => void;
  logout: () => void;
  updateAccessToken: (newAccessToken: string) => void;
  updateUser: (updatedUser: Partial<UserAuthType>) => void;
  verifyUser: () => void;
  reinitialize: () => void;
};

export type AuthStoreType = AuthState & AuthActions;


export interface TDoctor {
  doctor_id: number;
  name: string;
  email: string;
  specialization: string;
  license_number: string;
  availability: string;
  consultation_fee: number;
}

export interface TPatient {
  patient_id: number;
  name: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;

}

export interface TAppointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_time: string;
  status: string;
  reason: string;
  created_at: string;
}

export interface TPrescription {
  prescription_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number;
  notes: string;
  created_at: string;
}

export interface TPharmacyOrder {
  pharmacy_order_id: number;
  patient_id: number;
  doctor_id: number;
  quantity: number;
  status: string;
  created_at: string;
}

export interface TMedicine {
  medicine_id: number;
  name: string;
  description: string;
  stock_quantity: number;
  price: number;
  expiry_date: string;
}

export interface TRecord{
  record_id: number;
  patient_id: number;
  doctor_id: number;
  prescription_id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TPayment {
  payment_id: number; 
  appointment_id: number;
  patient_id: number; 
  payment_method: string;
  pharmacy_order_id: number;
  created_at: string;
  amount: number; 
  status: string;
}
  
