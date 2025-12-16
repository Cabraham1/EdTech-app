import { StudentService } from '@/lib/services/studentService'
import { studentRepository } from '@/lib/data/repository'
import { Student, StudentInput } from '@/lib/data/types'

jest.mock('@/lib/data/repository', () => ({
  studentRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByRegistrationNumber: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  },
}))

describe('StudentService', () => {
  let studentService: StudentService
  const mockRepository = studentRepository as jest.Mocked<typeof studentRepository>

  beforeEach(() => {
    jest.clearAllMocks()
    studentService = new StudentService()
  })

  describe('getAllStudents', () => {
    it('should return all students with filters', async () => {
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'John Doe',
          registrationNumber: '202401234',
          major: 'Computer Science',
          dob: '2001-05-05',
          gpa: 3.8,
        },
      ]

      mockRepository.search.mockResolvedValue(mockStudents)

      const result = await studentService.getAllStudents('John', 3.0, 4.0)

      expect(mockRepository.search).toHaveBeenCalledWith('John', 3.0, 4.0)
      expect(result).toEqual(mockStudents)
    })
  })

  describe('getStudentById', () => {
    it('should return student if found', async () => {
      const mockStudent: Student = {
        id: '1',
        name: 'John Doe',
        registrationNumber: '202401234',
        major: 'Computer Science',
        dob: '2001-05-05',
        gpa: 3.8,
      }

      mockRepository.findById.mockResolvedValue(mockStudent)

      const result = await studentService.getStudentById('1')

      expect(result).toEqual(mockStudent)
    })

    it('should throw error if student not found', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(studentService.getStudentById('1')).rejects.toThrow(
        'Student with id 1 not found'
      )
    })
  })

  describe('createStudent', () => {
    const validInput: StudentInput = {
      name: 'John Doe',
      registrationNumber: '202401234',
      major: 'Computer Science',
      dob: '2001-05-05',
      gpa: 3.8,
    }

    it('should create student with valid input', async () => {
      const mockStudent: Student = {
        ...validInput,
        id: '1',
      }

      mockRepository.findByRegistrationNumber.mockResolvedValue(null)
      mockRepository.create.mockResolvedValue(mockStudent)

      const result = await studentService.createStudent(validInput)

      expect(mockRepository.create).toHaveBeenCalled()
      expect(result).toEqual(mockStudent)
    })

    it('should throw error if registration number exists', async () => {
      const existingStudent: Student = {
        ...validInput,
        id: '1',
      }

      mockRepository.findByRegistrationNumber.mockResolvedValue(existingStudent)

      await expect(studentService.createStudent(validInput)).rejects.toThrow(
        'Registration number already exists'
      )
    })

    it('should throw error with validation errors for invalid input', async () => {
      const invalidInput: StudentInput = {
        ...validInput,
        name: '',
      }

      await expect(studentService.createStudent(invalidInput)).rejects.toThrow(
        'Validation failed'
      )
    })
  })

  describe('updateStudent', () => {
    const existingStudent: Student = {
      id: '1',
      name: 'John Doe',
      registrationNumber: '202401234',
      major: 'Computer Science',
      dob: '2001-05-05',
      gpa: 3.8,
    }

    it('should update student with valid input', async () => {
      const updateInput: Partial<StudentInput> = {
        name: 'Jane Doe',
      }

      const updatedStudent: Student = {
        ...existingStudent,
        ...updateInput,
      }

      mockRepository.findById.mockResolvedValue(existingStudent)
      mockRepository.update.mockResolvedValue(updatedStudent)

      const result = await studentService.updateStudent('1', updateInput)

      expect(mockRepository.update).toHaveBeenCalledWith('1', updateInput)
      expect(result).toEqual(updatedStudent)
    })

    it('should throw error if student not found', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(
        studentService.updateStudent('1', { name: 'Jane Doe' })
      ).rejects.toThrow('Student with id 1 not found')
    })
  })

  describe('deleteStudent', () => {
    const existingStudent: Student = {
      id: '1',
      name: 'John Doe',
      registrationNumber: '202401234',
      major: 'Computer Science',
      dob: '2001-05-05',
      gpa: 3.8,
    }

    it('should delete student if found', async () => {
      mockRepository.findById.mockResolvedValue(existingStudent)
      mockRepository.delete.mockResolvedValue(undefined)

      await studentService.deleteStudent('1')

      expect(mockRepository.delete).toHaveBeenCalledWith('1')
    })

    it('should throw error if student not found', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(studentService.deleteStudent('1')).rejects.toThrow(
        'Student with id 1 not found'
      )
    })
  })
})

