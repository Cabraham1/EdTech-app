import { validateStudentInput } from '@/lib/utils/validation'
import { StudentInput } from '@/lib/data/types'

describe('validateStudentInput', () => {
  const validInput: StudentInput = {
    name: 'John Doe',
    registrationNumber: '202401234',
    major: 'Computer Science',
    dob: '2001-05-05',
    gpa: 3.8,
  }

  describe('name validation', () => {
    it('should reject empty name', () => {
      const errors = validateStudentInput({ ...validInput, name: '' })
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name is required',
      })
    })

    it('should reject name shorter than 2 characters', () => {
      const errors = validateStudentInput({ ...validInput, name: 'A' })
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name must be between 2 and 100 characters',
      })
    })

    it('should reject name longer than 100 characters', () => {
      const errors = validateStudentInput({
        ...validInput,
        name: 'A'.repeat(101),
      })
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name must be between 2 and 100 characters',
      })
    })

    it('should accept valid name', () => {
      const errors = validateStudentInput(validInput)
      expect(errors.filter((e) => e.field === 'name')).toHaveLength(0)
    })
  })

  describe('registrationNumber validation', () => {
    it('should reject empty registration number', () => {
      const errors = validateStudentInput({
        ...validInput,
        registrationNumber: '',
      })
      expect(errors).toContainEqual({
        field: 'registrationNumber',
        message: 'Registration number is required',
      })
    })

    it('should reject invalid format', () => {
      const errors = validateStudentInput({
        ...validInput,
        registrationNumber: '12345',
      })
      expect(errors).toContainEqual({
        field: 'registrationNumber',
        message: 'Registration number must be 9 digits (e.g., 202401234)',
      })
    })

    it('should accept valid registration number', () => {
      const errors = validateStudentInput(validInput)
      expect(
        errors.filter((e) => e.field === 'registrationNumber')
      ).toHaveLength(0)
    })
  })

  describe('major validation', () => {
    it('should reject empty major', () => {
      const errors = validateStudentInput({ ...validInput, major: '' })
      expect(errors).toContainEqual({
        field: 'major',
        message: 'Major is required',
      })
    })

    it('should accept valid major', () => {
      const errors = validateStudentInput(validInput)
      expect(errors.filter((e) => e.field === 'major')).toHaveLength(0)
    })
  })

  describe('dob validation', () => {
    it('should reject empty date of birth', () => {
      const errors = validateStudentInput({ ...validInput, dob: '' })
      expect(errors).toContainEqual({
        field: 'dob',
        message: 'Date of birth is required',
      })
    })

    it('should reject future date', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      const errors = validateStudentInput({
        ...validInput,
        dob: futureDate.toISOString().split('T')[0],
      })
      expect(errors).toContainEqual({
        field: 'dob',
        message: 'Date of birth cannot be in the future',
      })
    })

    it('should reject age less than 16', () => {
      const recentDate = new Date()
      recentDate.setFullYear(recentDate.getFullYear() - 15)
      const errors = validateStudentInput({
        ...validInput,
        dob: recentDate.toISOString().split('T')[0],
      })
      expect(errors).toContainEqual({
        field: 'dob',
        message: 'Student must be at least 16 years old',
      })
    })

    it('should accept valid date of birth', () => {
      const errors = validateStudentInput(validInput)
      expect(errors.filter((e) => e.field === 'dob')).toHaveLength(0)
    })
  })

  describe('gpa validation', () => {
    it('should reject undefined GPA', () => {
      const errors = validateStudentInput({
        ...validInput,
        gpa: undefined as any,
      })
      expect(errors).toContainEqual({
        field: 'gpa',
        message: 'GPA is required',
      })
    })

    it('should reject GPA less than 0', () => {
      const errors = validateStudentInput({ ...validInput, gpa: -0.1 })
      expect(errors).toContainEqual({
        field: 'gpa',
        message: 'GPA must be between 0.0 and 4.0',
      })
    })

    it('should reject GPA greater than 4', () => {
      const errors = validateStudentInput({ ...validInput, gpa: 4.1 })
      expect(errors).toContainEqual({
        field: 'gpa',
        message: 'GPA must be between 0.0 and 4.0',
      })
    })

    it('should accept valid GPA', () => {
      const errors = validateStudentInput(validInput)
      expect(errors.filter((e) => e.field === 'gpa')).toHaveLength(0)
    })
  })

  describe('update mode', () => {
    it('should not validate undefined fields in update mode', () => {
      const errors = validateStudentInput({ name: 'John Doe' }, true)
      expect(errors.filter((e) => e.field === 'registrationNumber')).toHaveLength(0)
      expect(errors.filter((e) => e.field === 'major')).toHaveLength(0)
    })
  })
})

