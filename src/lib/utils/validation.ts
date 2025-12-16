import { StudentInput, ValidationError } from "../data/types";
import { VALIDATION_RULES } from "./constants";

export function validateStudentInput(
  input: Partial<StudentInput>,
  isUpdate = false
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isUpdate || input.name !== undefined) {
    if (!input.name || input.name.trim().length === 0) {
      errors.push({ field: "name", message: "Name is required" });
    } else if (
      input.name.length < VALIDATION_RULES.name.minLength ||
      input.name.length > VALIDATION_RULES.name.maxLength
    ) {
      errors.push({
        field: "name",
        message: `Name must be between ${VALIDATION_RULES.name.minLength} and ${VALIDATION_RULES.name.maxLength} characters`,
      });
    } else if (!VALIDATION_RULES.name.pattern.test(input.name)) {
      errors.push({
        field: "name",
        message: "Name can only contain letters, numbers, and spaces",
      });
    }
  }

  if (!isUpdate || input.registrationNumber !== undefined) {
    if (
      !input.registrationNumber ||
      input.registrationNumber.trim().length === 0
    ) {
      errors.push({
        field: "registrationNumber",
        message: "Registration number is required",
      });
    } else if (
      !VALIDATION_RULES.registrationNumber.pattern.test(
        input.registrationNumber
      )
    ) {
      errors.push({
        field: "registrationNumber",
        message: "Registration number must be 9 digits (e.g., 202401234)",
      });
    }
  }

  if (!isUpdate || input.major !== undefined) {
    if (!input.major || input.major.trim().length === 0) {
      errors.push({ field: "major", message: "Major is required" });
    } else if (
      input.major.length < VALIDATION_RULES.major.minLength ||
      input.major.length > VALIDATION_RULES.major.maxLength
    ) {
      errors.push({
        field: "major",
        message: `Major must be between ${VALIDATION_RULES.major.minLength} and ${VALIDATION_RULES.major.maxLength} characters`,
      });
    }
  }

  if (!isUpdate || input.dob !== undefined) {
    if (!input.dob || input.dob.trim().length === 0) {
      errors.push({ field: "dob", message: "Date of birth is required" });
    } else {
      const dob = new Date(input.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (isNaN(dob.getTime())) {
        errors.push({ field: "dob", message: "Invalid date format" });
      } else if (dob > today) {
        errors.push({
          field: "dob",
          message: "Date of birth cannot be in the future",
        });
      } else if (
        age < VALIDATION_RULES.age.min ||
        (age === VALIDATION_RULES.age.min && monthDiff < 0)
      ) {
        errors.push({
          field: "dob",
          message: `Student must be at least ${VALIDATION_RULES.age.min} years old`,
        });
      }
    }
  }

  if (!isUpdate || input.gpa !== undefined) {
    if (input.gpa === undefined || input.gpa === null) {
      errors.push({ field: "gpa", message: "GPA is required" });
    } else {
      const gpa = Number(input.gpa);
      if (isNaN(gpa)) {
        errors.push({ field: "gpa", message: "GPA must be a number" });
      } else if (
        gpa < VALIDATION_RULES.gpa.min ||
        gpa > VALIDATION_RULES.gpa.max
      ) {
        errors.push({
          field: "gpa",
          message: `GPA must be between ${VALIDATION_RULES.gpa.min} and ${VALIDATION_RULES.gpa.max}`,
        });
      } else {
        const decimalPlaces = (gpa.toString().split(".")[1] || "").length;
        if (decimalPlaces > VALIDATION_RULES.gpa.decimals) {
          errors.push({
            field: "gpa",
            message: `GPA can have at most ${VALIDATION_RULES.gpa.decimals} decimal places`,
          });
        }
      }
    }
  }

  return errors;
}

export function formatGPA(gpa: number): number {
  return Math.round(gpa * 100) / 100;
}
