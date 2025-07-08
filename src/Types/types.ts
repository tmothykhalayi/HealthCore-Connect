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
