import {
  Container,
  Heading,
  Box,
  Button,
  Card,
  CardBody,
} from '@chakra-ui/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studentService } from '@/lib/services/studentService'
import { StudentForm } from '@/components/StudentForm'

interface EditStudentPageProps {
  params: {
    id: string
  }
}

export default async function EditStudentPage({
  params,
}: EditStudentPageProps) {
  let student
  try {
    student = await studentService.getStudentById(params.id)
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      notFound()
    }
    throw error
  }

  return (
    <Container maxW="container.md" py={8}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Edit Student</Heading>
        <Button as={Link} href={`/students/${params.id}`} variant="outline">
          Back to Profile
        </Button>
      </Box>

      <Card>
        <CardBody>
          <StudentForm student={student} isEdit />
        </CardBody>
      </Card>
    </Container>
  )
}

