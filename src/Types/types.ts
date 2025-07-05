 export interface loginResponse {
    accessToken: string;
    refreshToken: string;
    role: string;
    user_id: string;

 }

 export interface loginType{
    email: string;
    password: string;
 }