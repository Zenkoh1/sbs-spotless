export type CleaningScheduleBackendType = {
  id: number;
  user_id: number;
  bus_id: number;
  date: string; // Backend provides the date as a string
  status: boolean;
};

export type CleaningScheduleType = Omit<CleaningScheduleBackendType, "date"> & {
  date: Date; // Override `date` to be of type `Date`
};
