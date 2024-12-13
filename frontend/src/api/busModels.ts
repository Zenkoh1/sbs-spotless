import axios from "axios";
import BusModel from "../types/BusModel.type";
import { BACKEND_URL } from "../constants";

export function retrieveAllBusModels(): Promise<BusModel[]> {
  return axios.get(`${BACKEND_URL}bus_models`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  ).then((response) => response.data);
}

export function editBusModel(busModel: BusModel): Promise<BusModel> {
  const formData = new FormData();
  formData.append("name", busModel.name);
  formData.append("description", busModel.description);
  if (busModel.image instanceof File) {
    formData.append("image", busModel.image);
  }
  return axios.patch(`${BACKEND_URL}bus_models/${busModel.id}/`, 
    formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "multipart/form-data",
      },
    },
  ).then((response) => response.data);
}

export function createBusModel(busModel: BusModel): Promise<BusModel> {
  const formData = new FormData();
  formData.append("name", busModel.name);
  formData.append("description", busModel.description);
  if (busModel.image) {
    formData.append("image", busModel.image);
  }
  return axios.post(`${BACKEND_URL}bus_models/`, 
    formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "multipart/form-data",
      },
    },
  ).then((response) => response.data);
}

export function deleteBusModel(busModelId: number): Promise<void> {
  return axios.delete(`${BACKEND_URL}bus_models/${busModelId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  );
}