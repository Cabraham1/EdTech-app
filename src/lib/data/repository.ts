import { randomUUID } from "crypto";
import { Student, StudentInput } from "./types";

let inMemoryStore: Student[] | null = null;

async function initializeData(initialData?: Student[]): Promise<Student[]> {
  if (inMemoryStore !== null) {
    return inMemoryStore;
  }

  if (initialData && initialData.length > 0) {
    inMemoryStore = initialData;
    return inMemoryStore;
  }

  inMemoryStore = [];
  return inMemoryStore;
}

async function readStudents(): Promise<Student[]> {
  if (inMemoryStore !== null) {
    return [...inMemoryStore];
  }
  return await initializeData();
}

async function writeStudents(students: Student[]): Promise<void> {
  inMemoryStore = students;
}

export class StudentRepository {
  private static cache: Student[] | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_TTL = 5000;

  private static isCacheValid(): boolean {
    return (
      this.cache !== null && Date.now() - this.cacheTimestamp < this.CACHE_TTL
    );
  }

  async findAll(): Promise<Student[]> {
    const students = await readStudents();
    StudentRepository.cache = students;
    StudentRepository.cacheTimestamp = Date.now();
    return [...students];
  }

  async findById(id: string): Promise<Student | null> {
    const students = await this.findAll();
    return students.find((s) => s.id === id) || null;
  }

  async findByRegistrationNumber(
    registrationNumber: string
  ): Promise<Student | null> {
    const students = await this.findAll();
    return (
      students.find((s) => s.registrationNumber === registrationNumber) || null
    );
  }

  async create(input: StudentInput): Promise<Student> {
    const students = await this.findAll();
    const newStudent: Student = {
      ...input,
      id: randomUUID(),
    };
    students.push(newStudent);
    await writeStudents(students);
    StudentRepository.cache = students;
    StudentRepository.cacheTimestamp = Date.now();
    return { ...newStudent };
  }

  async update(id: string, input: Partial<StudentInput>): Promise<Student> {
    const students = await this.findAll();
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Student with id ${id} not found`);
    }

    const updatedStudent: Student = {
      ...students[index],
      ...input,
      id,
    };

    students[index] = updatedStudent;
    await writeStudents(students);
    StudentRepository.cache = students;
    StudentRepository.cacheTimestamp = Date.now();
    return { ...updatedStudent };
  }

  async delete(id: string): Promise<void> {
    const students = await this.findAll();
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Student with id ${id} not found`);
    }

    students.splice(index, 1);
    await writeStudents(students);
    StudentRepository.cache = students;
    StudentRepository.cacheTimestamp = Date.now();
  }

  async search(
    query?: string,
    minGpa?: number,
    maxGpa?: number
  ): Promise<Student[]> {
    let students = await this.findAll();

    if (query) {
      const lowerQuery = query.toLowerCase();
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerQuery) ||
          s.registrationNumber.includes(lowerQuery) ||
          s.major.toLowerCase().includes(lowerQuery)
      );
    }

    if (minGpa !== undefined) {
      students = students.filter((s) => s.gpa >= minGpa);
    }

    if (maxGpa !== undefined) {
      students = students.filter((s) => s.gpa <= maxGpa);
    }

    return students;
  }

  async syncWithClient(clientStudents: Student[]): Promise<void> {
    if (!clientStudents || clientStudents.length === 0) {
      return;
    }

    if (inMemoryStore === null) {
      inMemoryStore = [...clientStudents];
      StudentRepository.cache = inMemoryStore;
      StudentRepository.cacheTimestamp = Date.now();
      return;
    }

    const serverStudents = await this.findAll();
    const clientMap = new Map(clientStudents.map((s) => [s.id, s]));
    const serverMap = new Map(serverStudents.map((s) => [s.id, s]));

    const merged = new Map<string, Student>();

    for (const [id, student] of clientMap) {
      merged.set(id, student);
    }

    for (const [id, student] of serverMap) {
      if (!merged.has(id)) {
        merged.set(id, student);
      }
    }

    const mergedStudents = Array.from(merged.values());
    await writeStudents(mergedStudents);
    StudentRepository.cache = mergedStudents;
    StudentRepository.cacheTimestamp = Date.now();
  }
}

export const studentRepository = new StudentRepository();
