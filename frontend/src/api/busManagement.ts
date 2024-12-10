import axios from "axios";
import BusModel from "../types/BusModel.type";
import { BACKEND_URL } from "../constants";

export function retrieveAllBusModels(): Promise<BusModel[]> {
  return axios.get(`${BACKEND_URL}busmodels`);
}