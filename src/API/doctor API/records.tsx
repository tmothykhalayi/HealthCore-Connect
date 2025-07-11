import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";
import type { TRecord } from "@/Types/types";


export const getRecordsFn = async () : Promise <{
  data: TRecord[];
}> => {
  const fullUrl = `${url}/records`;
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