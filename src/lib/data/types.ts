export interface Student {
  id: string
  name: string
  registrationNumber: string
  major: string
  dob: string
  gpa: number
}

export interface StudentInput {
  name: string
  registrationNumber: string
  major: string
  dob: string
  gpa: number
}

export interface ValidationError {
  field: string
  message: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  errors?: ValidationError[]
}

