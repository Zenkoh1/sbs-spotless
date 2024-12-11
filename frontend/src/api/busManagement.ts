import axios from "axios";
import BusModel from "../types/BusModel.type";
import { BACKEND_URL } from "../constants";

export function retrieveAllBusModels(): Promise<BusModel[]> {
  return axios.get(`${BACKEND_URL}bus_models`);
}

export function editBusModel(busModel: BusModel): Promise<BusModel> {
  return axios.put(`${BACKEND_URL}bus_models/${busModel.id}`, busModel);
}

export function createBusModel(busModel: BusModel): Promise<BusModel> {
  return axios.post(`${BACKEND_URL}bus_models`, busModel);
}

export function deleteBusModel(busModelId: number): Promise<void> {
  return axios.delete(`${BACKEND_URL}bus_models/${busModelId}`);
}