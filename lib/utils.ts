import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// fonction

export const daysOfWeek = [
  { id: "monday", label: { fr: "Lundi", nl: "Maandag" } },
  { id: "tuesday", label: { fr: "Mardi", nl: "Dinsdag" } },
  { id: "wednesday", label: { fr: "Mercredi", nl: "Woensdag" } },
  { id: "thursday", label: { fr: "Jeudi", nl: "Donderdag" } },
  { id: "friday", label: { fr: "Vendredi", nl: "Vrijdag" } },
  { id: "saturday", label: { fr: "Samedi", nl: "Zaterdag" } },
  { id: "sunday", label: { fr: "Dimanche", nl: "Zondag" } },
];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
}
