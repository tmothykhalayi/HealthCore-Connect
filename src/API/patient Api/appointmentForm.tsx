import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";

export const getAppointmentFormFn =  async () => {
    const fullUrl = `${url}/patients/appointment-form`;
    const token = getAccessTokenHelper();

    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch appointment form');
    }

    const data = await response.json();
    console.log("Fetched appointment form data:", data);
    return data;
}

export const postAppointmentFormFn = async () => {
    const fullUrl = `${url}/patients/appointment-form`;``
    const token = getAccessTokenHelper();

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
        })
    });

    if (!response.ok) {
        throw new Error('Failed to submit appointment form');
    }

    const data = await response.json();
    console.log("Submitted appointment form data:", data);
    return data;
}