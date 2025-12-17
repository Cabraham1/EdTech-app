'use client'

import { useEffect } from 'react'
import { Student } from '../data/types'
import {
  getStudentsFromStorage,
  saveStudentsToStorage,
} from '../storage/localStorage'

export function useStudentStorage() {
  const syncToStorage = (students: Student[]) => {
    saveStudentsToStorage(students)
  }

  const getFromStorage = (): Student[] => {
    return getStudentsFromStorage()
  }

  const getStorageHeader = (): Record<string, string> => {
    const students = getStudentsFromStorage()
    if (students.length > 0) {
      return {
        'x-client-data': JSON.stringify(students),
      }
    }
    return {}
  }

  return {
    syncToStorage,
    getFromStorage,
    getStorageHeader,
  }
}

