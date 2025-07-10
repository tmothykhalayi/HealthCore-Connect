import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";
import type { TPatient } from "@/Types/types";



export const getPatientsFn = async (): Promise<{
  data: TPatient[];
}> => {
  const fullUrl = `${url}/patients`;
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