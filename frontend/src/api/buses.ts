import axios from "axios";
import { BACKEND_URL } from "../constants";
import Bus from "../types/Bus.type";

export function retrieveAllBuses(): Promise<Bus[]> {
  return axios.get(`${BACKEND_URL}buses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  ).then((response) => response.data);
}

export function editBus(bus: Bus): Promise<Bus> {
  return axios.patch(`${BACKEND_URL}buses/${bus.id}/`, 
    bus, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  ).then((response) => response.data);
}

export function createBus(bus: Bus): Promise<Bus> {
  return axios.post(`${BACKEND_URL}buses/`, 
    bus, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  ).then((response) => response.data);
}

export function deleteBus(busId: number): Promise<void> {
  return axios.delete(`${BACKEND_URL}buses/${busId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  );
}