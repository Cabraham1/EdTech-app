import { NextRequest, NextResponse } from 'next/server'
import { studentService } from '@/lib/services/studentService'
import { StudentInput } from '@/lib/data/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || undefined
    const minGpa = searchParams.get('minGpa')
      ? parseFloat(searchParams.get('minGpa')!)
      : undefined
    const maxGpa = searchParams.get('maxGpa')
      ? parseFloat(searchParams.get('maxGpa')!)
      : undefined

    const students = await studentService.getAllStudents(search, minGpa, maxGpa)
    return NextResponse.json({ students }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const student = await studentService.createStudent(body as StudentInput)

    return NextResponse.json({ student }, { status: 201 })
  } catch (error: any) {
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
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}

