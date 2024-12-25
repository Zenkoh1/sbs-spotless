import axios from "axios";
import { BACKEND_URL } from "../constants";

export function registerCleaner({ name, email, password }: { name: string, email: string, password: string }): Promise<any> {
    return axios.post(`${BACKEND_URL}register`, { name, email, password });
}

export function getCleaners(): Promise<any[]> {
    return axios.get(`${BACKEND_URL}cleaners`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    })
    .then(response => response.data) // Assuming the cleaner data is in `response.data`
    .catch((error) => {
        console.error("Error fetching cleaners:", error);
        throw error; // Re-throw to handle further up the chain
    });
}