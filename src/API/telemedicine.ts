import axios from 'axios';
import { API_BASE_URL } from './BaseUrl';

export interface TelemedicineSession {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  roomId: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id?: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor';
  message: string;
  timestamp: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
}

// GET all telemedicine sessions
export const getTelemedicineSessions = async (): Promise<TelemedicineSession[]> => {
  const response = await axios.get(`${API_BASE_URL}/telemedicine/sessions`);
  return response.data;
}

// GET sessions by doctor ID
export const getSessionsByDoctor = async (doctorId: string): Promise<TelemedicineSession[]> => {
  const response = await axios.get(`${API_BASE_URL}/telemedicine/sessions/doctor/${doctorId}`);
  return response.data;
}

// GET sessions by patient ID
export const getSessionsByPatient = async (patientId: string): Promise<TelemedicineSession[]> => {
  const response = await axios.get(`${API_BASE_URL}/telemedicine/sessions/patient/${patientId}`);
  return response.data;
}

// GET session by ID
export const getSessionById = async (id: string): Promise<TelemedicineSession> => {
  const response = await axios.get(`${API_BASE_URL}/telemedicine/sessions/${id}`);
  return response.data;
}

// CREATE session
export const createSession = async (sessionData: Partial<TelemedicineSession>): Promise<TelemedicineSession> => {
  const response = await axios.post(`${API_BASE_URL}/telemedicine/sessions`, sessionData);
  return response.data;
}

// UPDATE session
export const updateSession = async (id: string, sessionData: Partial<TelemedicineSession>): Promise<TelemedicineSession> => {
  const response = await axios.put(`${API_BASE_URL}/telemedicine/sessions/${id}`, sessionData);
  return response.data;
}

// DELETE session
export const deleteSession = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/telemedicine/sessions/${id}`);
}

// Start session
export const startSession = async (id: string): Promise<TelemedicineSession> => {
  const response = await axios.post(`${API_BASE_URL}/telemedicine/sessions/${id}/start`);
  return response.data;
}

// End session
export const endSession = async (id: string): Promise<TelemedicineSession> => {
  const response = await axios.post(`${API_BASE_URL}/telemedicine/sessions/${id}/end`);
  return response.data;
}

// GET chat messages for a session
export const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  const response = await axios.get(`${API_BASE_URL}/telemedicine/sessions/${sessionId}/messages`);
  return response.data;
}

// SEND chat message
export const sendChatMessage = async (sessionId: string, messageData: Partial<ChatMessage>): Promise<ChatMessage> => {
  const response = await axios.post(`${API_BASE_URL}/telemedicine/sessions/${sessionId}/messages`, messageData);
  return response.data;
}

// Get session room details
export const getSessionRoom = async (sessionId: string): Promise<{ roomId: string; token: string }> => {
  const response = await axios.get(`${API_BASE_URL}/telemedicine/sessions/${sessionId}/room`);
  return response.data;
} 