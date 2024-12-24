import axios from 'axios';
import { BACKEND_URL } from '../constants';
import User from '../types/User.type';

export function retrieveAllCleaners(): Promise<User[]> {
  return axios.get(`${BACKEND_URL}cleaners/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }).then((response) => response.data);
}