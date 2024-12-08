import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { BACKEND_URL } from "../constants";

/* General purpose hook for making API calls */
const useAPI = <T>(pathname: string, options?: AxiosRequestConfig) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const fetchAPI = async () => {
    try {
      const response = await axios(`${BACKEND_URL}${pathname}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = await response.data;
      setData(data);
      setLoading(false);
    } catch (error) {
      alert("Error fetching data");
    }
  };

  return { fetchAPI, loading, data };
};

export default useAPI;
