"use client";

import { useEffect } from "react";
import { useStudentStorage } from "@/lib/hooks/useStudentStorage";

export function StudentStorageSync() {
  const { getFromStorage, syncToStorage, getStorageHeader } =
    useStudentStorage();

  useEffect(() => {
    const syncOnLoad = async () => {
      const storedStudents = getFromStorage();
      if (storedStudents.length > 0) {
        try {
          const headers: Record<string, string> = {
            ...getStorageHeader(),
          };

          const response = await fetch("/api/students", {
            method: "GET",
            headers,
          });

          if (response.ok) {
            const result = await response.json();
            if (result.students) {
              syncToStorage(result.students);
            }
          }
        } catch (error) {
          // Silent fail - localStorage will be used as fallback
        }
      }
    };

    syncOnLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
