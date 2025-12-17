import { Student, StudentInput, ValidationError } from "../data/types";
import { studentRepository } from "../data/repository";
import { validateStudentInput, formatGPA } from "../utils/validation";

export class StudentService {
  async getAllStudents(
    search?: string,
    minGpa?: number,
    maxGpa?: number
  ): Promise<Student[]> {
    return await studentRepository.search(search, minGpa, maxGpa);
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }
    return student;
  }

  async createStudent(input: StudentInput): Promise<Student> {
    const validationErrors = validateStudentInput(input, false);
    if (validationErrors.length > 0) {
      const error = new Error("Validation failed");
      (error as any).validationErrors = validationErrors;
      throw error;
    }

    const existing = await studentRepository.findByRegistrationNumber(
      input.registrationNumber
    );
    if (existing) {
      const error = new Error("Registration number already exists");
      (error as any).validationErrors = [
        {
          field: "registrationNumber",
          message: "This registration number is already in use",
        },
      ];
      throw error;
    }

    const normalizedInput: StudentInput = {
      ...input,
      name: input.name.trim(),
      registrationNumber: input.registrationNumber.trim(),
      major: input.major.trim(),
      gpa: formatGPA(input.gpa),
    };

    return await studentRepository.create(normalizedInput);
  }

  async updateStudent(
    id: string,
    input: Partial<StudentInput>
  ): Promise<Student> {
    const existing = await studentRepository.findById(id);
    if (!existing) {
      throw new Error(`Student with id ${id} not found`);
    }

    const updateData: Partial<StudentInput> = {
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.registrationNumber !== undefined && {
        registrationNumber: input.registrationNumber.trim(),
      }),
      ...(input.major !== undefined && { major: input.major.trim() }),
      ...(input.dob !== undefined && { dob: input.dob }),
      ...(input.gpa !== undefined && { gpa: formatGPA(input.gpa) }),
    };

    const validationErrors = validateStudentInput(
      { ...existing, ...updateData },
      true
    );
    if (validationErrors.length > 0) {
      const error = new Error("Validation failed");
      (error as any).validationErrors = validationErrors;
      throw error;
    }

    if (
      updateData.registrationNumber &&
      updateData.registrationNumber !== existing.registrationNumber
    ) {
      const duplicate = await studentRepository.findByRegistrationNumber(
        updateData.registrationNumber
      );
      if (duplicate && duplicate.id !== id) {
        const error = new Error("Registration number already exists");
        (error as any).validationErrors = [
          {
            field: "registrationNumber",
            message: "This registration number is already in use",
          },
        ];
        throw error;
      }
    }

    return await studentRepository.update(id, updateData);
  }

  async deleteStudent(id: string): Promise<void> {
    const existing = await studentRepository.findById(id);
    if (!existing) {
      throw new Error(`Student with id ${id} not found`);
    }
    await studentRepository.delete(id);
  }

  async syncStudents(clientStudents: Student[]): Promise<void> {
    await studentRepository.syncWithClient(clientStudents);
  }
}

export const studentService = new StudentService();
