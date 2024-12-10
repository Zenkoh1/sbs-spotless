export type CleaningScheduleBackendType = {
  id: number;
  user_id: number;
  bus_id: number;
  date: string; // Backend provides the date as a string
  status: boolean;
};

export type CleaningScheduleType = Omit<
  CleaningScheduleBackendType,
  "date" | "bus_id"
> & {
  date: Date; // Override `date` to be of type `Date`
  bus_ids: number[]; // Override `bus_id` to be of type `number[]`
};
