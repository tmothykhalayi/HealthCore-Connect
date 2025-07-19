import {API_BASE_URL} from "../BaseUrl";
import { getAccessTokenHelper } from "@/lib/auth";
import type { TRecord } from "@/types/alltypes";


export const getRecordsFn = async () : Promise <{
  data: TRecord[];
}> => {
  const fullUrl = `${API_BASE_URL}/records`;
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