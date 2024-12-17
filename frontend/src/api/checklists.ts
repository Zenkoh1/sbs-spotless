import axios from "axios";
import { BACKEND_URL } from "../constants";
import Checklist from "../types/Checklist.type";
import ChecklistItem from "../types/ChecklistItem.type";

export function retrieveAllChecklists(): Promise<Checklist[]> {
  return axios.get(`${BACKEND_URL}cleaning_checklists`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  ).then((response) => response.data);
}

export function retrieveChecklistById(checklistId: number): Promise<Checklist> {
  return axios.get(`${BACKEND_URL}cleaning_checklists/${checklistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  ).then((response) => response.data);
}

export function editChecklist(checklist: Checklist): Promise<Checklist> {
  return axios.patch(`${BACKEND_URL}cleaning_checklists/${checklist.id}/`, 
    checklist, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  ).then((response) => response.data);
}

export function createChecklist(checklist: Checklist): Promise<Checklist> {
  return axios.post(`${BACKEND_URL}cleaning_checklists/`, 
    checklist, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  ).then((response) => response.data);
}

export function deleteChecklist(checklistId: number): Promise<void> {
  return axios.delete(`${BACKEND_URL}cleaning_checklists/${checklistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  );
}

// --------------------------------------------------------

export function retrieveChecklistItems(checklistId: number): Promise<ChecklistItem[]> {
  return axios.get(`${BACKEND_URL}cleaning_checklists/${checklistId}/checklist_items/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  ).then((response) => response.data);
}

export function createChecklistItem(checklistId: number, checklistItem: ChecklistItem): Promise<ChecklistItem> {
  const formDate = new FormData();
  formDate.append("title", checklistItem.title);
  formDate.append("description", checklistItem.description);
  formDate.append("order", checklistItem.order.toString());
  formDate.append("is_image_required", checklistItem.is_image_required.toString());
  formDate.append("cleaning_checklist", checklistItem.cleaning_checklist.toString());
  if (checklistItem.image) {
    formDate.append("image", checklistItem.image);
  }
  return axios.post(`${BACKEND_URL}cleaning_checklists/${checklistId}/checklist_items/`,
    formDate, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "multipart/form-data",
      },
    },
  ).then((response) => response.data);
}


export function editChecklistItemOrder(checklistItemId: number, newOrder: number): Promise<void> {
  return axios.patch(`${BACKEND_URL}checklist_items/${checklistItemId}/`, 
    { order: newOrder }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  );
}

export function deleteChecklistItem(checklistItemId: number): Promise<void> {
  return axios.delete(`${BACKEND_URL}checklist_items/${checklistItemId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  );
}