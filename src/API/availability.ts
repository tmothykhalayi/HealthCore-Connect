// interface Availability
export enum FrontendAvailabilityType {
  STANDARD = 'standard',
  EMERGENCY = 'emergency',
  CONSULTATION = 'consultation',
}
export interface Availability {
  startTime: string
  endTime: string
  type: FrontendAvailabilityType
  status?: 'available' | 'unavailable'
  notes?: string
}
