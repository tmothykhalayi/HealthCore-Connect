import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";


export const getDoctorsFn = async () => {
    const fullUrl = `${url}/doctors`;
    const token = getAccessTokenHelper();

    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch doctors');
    }

    const data = await response.json();
    return data;
}