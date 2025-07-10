import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";


export const getPatientDetailsFn = async (patientId: number) => {
  const fullUrl = `${url}/patients/${patientId}`;
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