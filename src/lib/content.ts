import { isAxiosError } from "axios";

export interface Section {
  id: number;
  name: string;
  title: string;
  label: string | null;
  sort_order: number;
}
export interface Page {
  id: number;
  section_id: number;
  name: string;
  title: string;
  sort_order: number;
}
export interface PageInput {
  name: string;
  title: string;
  primary_image: string;
  abstract: string;
  content: string;
}
export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.error?.message ?? error.response?.data?.detail;
    if (typeof message === "string") return message;
  }
  return "Could not save this change. Please try again.";
}
