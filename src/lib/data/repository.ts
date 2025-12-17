import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Student, StudentInput } from "./types";
import { STUDENT_DATA_FILE } from "../utils/constants";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(process.cwd(), STUDENT_DATA_FILE);

let inMemoryStore: Student[] | null = null;
let isFileSystemWritable = true;

async function initializeData(): Promise<Student[]> {
  if (inMemoryStore !== null) {
    return inMemoryStore;
  }

  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    inMemoryStore = JSON.parse(fileContent) as Student[];
    return inMemoryStore;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
        inMemoryStore = [];
        return inMemoryStore;
      } catch (writeError) {
        isFileSystemWritable = false;
        inMemoryStore = [];
        return inMemoryStore;
      }
    }
    inMemoryStore = [];
    return inMemoryStore;
  }
}

async function readStudents(): Promise<Student[]> {
  if (inMemoryStore !== null) {
    return [...inMemoryStore];
  }
  return await initializeData();
}

async function writeStudents(students: Student[]): Promise<void> {
  inMemoryStore = students;

  if (!isFileSystemWritable) {
    return;
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), "utf-8");
  } catch (error) {
    isFileSystemWritable = false;
  }
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
}

export const studentRepository = new StudentRepository();
