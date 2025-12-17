'use client'

import { useCallback } from 'react'
import { Student } from '../data/types'
import {
  getStudentsFromStorage,
  saveStudentsToStorage,
} from '../storage/localStorage'

export function useStudentStorage() {
  const syncToStorage = useCallback((students: Student[]) => {
    saveStudentsToStorage(students)
  }, [])

  const getFromStorage = useCallback((): Student[] => {
    return getStudentsFromStorage()
  }, [])

  const getStorageHeader = useCallback((): Record<string, string> => {
    const students = getStudentsFromStorage()
    if (students.length > 0) {
      return {
        'x-client-data': JSON.stringify(students),
      }
    }
    return {}
  }, [])

  return {
    syncToStorage,
    getFromStorage,
    getStorageHeader,
  }
}

