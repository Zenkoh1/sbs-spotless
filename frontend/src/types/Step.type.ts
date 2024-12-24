import ChecklistItem from "./ChecklistItem.type";
import { ImageProps } from "./Image.type";

export type Step = {
  id: number;
  cleaning_checklist_item: ChecklistItem;
  images: ImageProps[]; // Array of image URLs or paths
  status: "IN_PROGRESS" | "COMPLETE" | "INCOMPLETE";
  created_at: string;
  updated_at: string;
  cleaning_schedule: number; // Refers to the cleaning schedule the checklist belongs to
};
