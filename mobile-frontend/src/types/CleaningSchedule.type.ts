export type CleaningSchedule_BackendType = {
  id: number;
  user_id: number;
  date: string; // Backend provides the date as a string
  bus_ids: number[]; // Backend provides the bus IDs as an array of numbers
  status: Status;
};

export enum Status {
  CLEANED = "cleaned",
  UNCLEANED = "uncleaned",
  ASSIGNED = "assigned",
}

export type CleaningChecklistItems_BackendType = {
  id: number;
  title: string;
  description: string;
};
// export type CleaningScheduleType = Omit<
//   CleaningScheduleBackendType,
//   "date" | "bus_id"
// > & {
//   date: Date; // Override `date` to be of type `Date`
//   bus_ids: number[]; // Override `bus_id` to be of type `number[]`
// };
