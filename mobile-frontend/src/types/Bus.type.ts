export type BusBackEndType = {
  id: number;
  bus_number: string;
  bus_model: string;
};

export type BusType = BusBackEndType & {
  isMarked: boolean;
};
