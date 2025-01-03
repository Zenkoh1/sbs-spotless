import axios from "axios";
import { SURVEY_URL } from "../constants";

export function retrieveAllSurveyResults() {
  return axios.get(`${SURVEY_URL}survey/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  ).then((response) => response.data);
}