import { NextRequest, NextResponse } from "next/server";
import { studentService } from "@/lib/services/studentService";
import { StudentInput, Student } from "@/lib/data/types";

async function syncWithClient(request: NextRequest): Promise<void> {
  try {
    const clientData = request.headers.get("x-client-data");
    if (clientData) {
      const students = JSON.parse(clientData) as Student[];
      if (Array.isArray(students) && students.length > 0) {
        await studentService.syncStudents(students);
      }
    }
  } catch {
    // Ignore sync errors
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await syncWithClient(request);

    const student = await studentService.getStudentById(params.id);
    return NextResponse.json({ student }, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("not found")) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await syncWithClient(request);

    const body = await request.json();
    const student = await studentService.updateStudent(
      params.id,
      body as Partial<StudentInput>
    );
    const allStudents = await studentService.getAllStudents();

    return NextResponse.json({ student, allStudents }, { status: 200 });
  } catch (error: any) {
    if (error.message?.includes("not found")) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (error.validationErrors) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.validationErrors.reduce(
            (acc: Record<string, string[]>, err: any) => {
              if (!acc[err.field]) {
                acc[err.field] = [];
              }
              acc[err.field].push(err.message);
              return acc;
            },
            {}
          ),
        },
        { status: 400 }
      );
    }

    if (error.message?.includes("already exists")) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.validationErrors
            ? error.validationErrors.reduce(
                (acc: Record<string, string[]>, err: any) => {
                  if (!acc[err.field]) {
                    acc[err.field] = [];
                  }
                  acc[err.field].push(err.message);
                  return acc;
                },
                {}
              )
            : {},
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await syncWithClient(request);

    await studentService.deleteStudent(params.id);
    const allStudents = await studentService.getAllStudents();

    return NextResponse.json(
      { message: "Student deleted successfully", allStudents },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message?.includes("not found")) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
