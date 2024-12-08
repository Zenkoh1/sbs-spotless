import axios
 from "axios";
import { BACKEND_URL } from "../constants";

// State
type UserStateType = {
    id: number | null;
    name: string | null;
    email: string | null;
    admin: boolean | null;
};

const state = {
    id: null,
    name: null,
    email: null,
    admin: null,
} as UserStateType;

export function loginUser({email, password}: {email: string, password: string}): Promise<any> {
  return axios.post(`${BACKEND_URL}login`, { email, password }).then((response) => {
       
        const data = response.data;
        state.id = data.id;
        state.name = data.name;
        state.email = data.email;
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
    });
}

export function loginUserWithToken(access_token: string): Promise<any> {
    return axios.post(`${BACKEND_URL}loginwithtoken`, {access_token}, {
    }).then((response) => {
        const data = response.data;
        state.id = data.id;
        state.name = data.name;
        state.email = data.email;
    });
}

export function logoutUser(): Promise<any> {
    return axios.post(`${BACKEND_URL}logout`, {refresh_token: localStorage.getItem("refresh_token")}, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    }).then(() => {
        state.id = null;
        state.name = null;
        state.email = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    });
}

export function registerUser({name, email, password}: {name: string, email: string, password: string}): Promise<any> {
    return axios.post(`${BACKEND_URL}register`, { name, email, password });
}

// Getters
export function getName(): string {
    return state.name || "";
}

export function getID(): number {
    return state.id || 0;
}