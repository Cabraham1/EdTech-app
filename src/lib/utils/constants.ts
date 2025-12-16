export const STUDENT_DATA_FILE = 'data/students.json'

export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s]+$/,
  },
  registrationNumber: {
    pattern: /^\d{9}$/,
  },
  major: {
    minLength: 2,
    maxLength: 100,
  },
  gpa: {
    min: 0.0,
    max: 4.0,
    decimals: 2,
  },
  age: {
    min: 16,
  },
} as const

