import { NextRequest, NextResponse } from 'next/server'
import { studentService } from '@/lib/services/studentService'
import { StudentInput } from '@/lib/data/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await studentService.getStudentById(params.id)
    return NextResponse.json({ student }, { status: 200 })
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const student = await studentService.updateStudent(
      params.id,
      body as Partial<StudentInput>
    )

    return NextResponse.json({ student }, { status: 200 })
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    if (error.validationErrors) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.validationErrors.reduce(
            (acc: Record<string, string[]>, err: any) => {
              if (!acc[err.field]) {
                acc[err.field] = []
              }
              acc[err.field].push(err.message)
              return acc
            },
            {}
          ),
        },
        { status: 400 }
      )
    }

    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.validationErrors
            ? error.validationErrors.reduce(
                (acc: Record<string, string[]>, err: any) => {
                  if (!acc[err.field]) {
                    acc[err.field] = []
                  }
                  acc[err.field].push(err.message)
                  return acc
                },
                {}
              )
            : {},
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await studentService.deleteStudent(params.id)
    return NextResponse.json(
      { message: 'Student deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}

