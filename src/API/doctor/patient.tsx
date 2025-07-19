import {API_BASE_URL} from "../BaseUrl";
import { getAccessTokenHelper } from "@/lib/auth";
import type { TPatient } from "@/types/alltypes";



export const getPatientsFn = async (): Promise<{
  data: TPatient[];
}> => {
  const fullUrl = `${API_BASE_URL}/patients`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}