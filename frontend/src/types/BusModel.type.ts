type BusModel = {
  id: number,
  name: string,
  image: File | string | null,
  description: string,
  created_at?: Date,
  updated_at?: Date,
}

export default BusModel;