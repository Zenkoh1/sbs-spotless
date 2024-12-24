export type CleaningChecklistItem_Backend_Type = {
  id: number;
  title: string;
  description: string;
  order: number;
  image: ImageProps | null; // If no image is provided, it will be `null`
  is_image_required: boolean;
  created_at: string;
  updated_at: string;
  cleaning_checklist: number; // Refers to the associated cleaning checklist
};

export type CleaningChecklistStep_Backend_Type = {
  id: number;
  cleaning_checklist_item: CleaningChecklistItem_Backend_Type;
  images: ImageProps[]; // Array of image URLs or paths
  status: "IN_PROGRESS" | "COMPLETE" | "INCOMPLETE";
  created_at: string;
  updated_at: string;
  cleaning_schedule: number; // Refers to the cleaning schedule the checklist belongs to
};

export type CleaningSchedule_Backend_Type = {
  bus: {
    id: number;
    number_plate: string;
    created_at: string; // ISO date format string
    updated_at: string; // ISO date format string
    bus_model: string;
  };
  cleaners: number[];
  cleaning_checklist: number;
  created_at: string; // ISO date format string
  datetime: string; // ISO date format string
  id: number;
  status: "UNASSIGNED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
  updated_at: string; // ISO date format string
};

/**
 * Grouped by datetime
 */
export type CleaningSchedule_Frontend_Type = {
  datetime: Date;
  schedules: CleaningSchedule_Backend_Type[];
};

export type CleanlinessSurvey_Backend_Type = {
  id: number;
  bus: number;
  rating: number;
  comment: string;
  email: string;
  images: ImageProps[]; // might change to image objects
  created_at: string;
  updated_at: string;
};

export type ImageProps = {
  cleanliness_level: number;
  created_at: string;
  id: number;
  image: string;
};
