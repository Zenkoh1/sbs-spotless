type ChecklistItem = {
  id: number;
  title: string;
  description: string;
  order: number;
  image: File | string | null;
  created_at?: Date;
  updated_at?: Date;
  cleaning_checklist: number;
  is_image_required: boolean;
};

export default ChecklistItem;