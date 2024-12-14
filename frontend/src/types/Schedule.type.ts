type Schedule = {
  id: number;
  datetime: Date;
  status: "UNASSIGNED" | "ASSIGNED" | "COMPLETED";
  created_at?: Date;
  updated_at?: Date;
  bus: number;
  cleaners: number[];
  cleaning_checklist: number;
}

export default Schedule;