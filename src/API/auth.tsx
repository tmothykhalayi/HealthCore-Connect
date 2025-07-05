import url from "@/constants/urls";

export const loginFn = async (email: string, password: string) => {
    const response = await fetch(`${url}/auth/login`, {
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
