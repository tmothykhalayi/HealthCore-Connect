import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";


export const getMedicineFn = async () => {
    const fullUrl = `${url}/patients/medicines`;
    const token = getAccessTokenHelper();

    const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch medicines");
    }
  const data = await response.json();
  console.log("Fetched medicines data:", data);
    return data;
}