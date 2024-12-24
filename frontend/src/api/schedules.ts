import axios from "axios";
import Schedule from "../types/Schedule.type";
import { BACKEND_URL } from "../constants";

export function retrieveAllSchedules(): Promise<Schedule[]> {
  return axios.get(`${BACKEND_URL}cleaning_schedules`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }).then((response) => response.data);
}

export function retrieveScheduleById(scheduleId: number): Promise<Schedule> {
  return axios.get(`${BACKEND_URL}cleaning_schedules/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }).then((response) => response.data);
}

export type ScheduleSingle = {
  datetime: Date,
  bus: number,
  cleaners: number[],
  cleaning_checklist: number
}

export function createSingleSchedule(schedule: ScheduleSingle): Promise<Schedule> {
  return axios.post(`${BACKEND_URL}cleaning_schedules/`, 
    schedule, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  ).then((response) => response.data);
}

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type ScheduleMass = {
  buses: number[],
  time: Date,
  cleaners: number[],
  cleaning_checklist: number,
  start_date: Date,
  end_date: Date,
  interval: "monthly" | "weekly",
  days_of_month?: number[],
  days_of_week?: DayOfWeek[]
}

export function createMassSchedule(schedule: ScheduleMass): Promise<Schedule[]> {
  return axios.post(`${BACKEND_URL}cleaning_schedules/mass_create`,
    schedule, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  ).then((response) => response.data);
}