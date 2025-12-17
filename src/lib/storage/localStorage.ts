"use client";

import { Student } from "../data/types";

const STORAGE_KEY = "edtech_students";

export function getStudentsFromStorage(): Student[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Student[];
    }
  } catch (error) {
    return [];
  }
  return [];
}

export function saveStudentsToStorage(students: Student[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    // Storage quota exceeded or other error
  }
}

export function clearStudentsStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Ignore errors
  }
}
