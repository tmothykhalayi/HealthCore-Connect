import {API_BASE_URL} from "../../BaseUrl";
import { getAccessTokenHelper } from "@/lib/auth";


export const getDoctorsFn = async () => {
    const fullUrl = `${API_BASE_URL}/patients/doctors`;
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
    console.log("Fetched doctors data:", data);
    return data;
}