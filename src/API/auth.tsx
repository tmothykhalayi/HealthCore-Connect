import { API_BASE_URL} from "../api/BaseUrl";

export const loginFn = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),

    });


    // if (!response.ok) {
    //     throw new Error('Login failed');
    // }

    const data = await response.json();
    return data;
};