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
    <Box
      bgGradient="linear(to-br, blue.50, purple.50)"
      minH="calc(100vh - 64px)"
      py={8}
    >
      <Container maxW="container.md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="xl" mb={2} color="blue.600">
              Edit Student
            </Heading>
            <Text color="gray.600">Update student information</Text>
          </Box>
          <Button as={Link} href={`/students/${params.id}`} variant="outline" size="md">
            Back to Profile
          </Button>
        </Box>

        <Card bg="white" boxShadow="xl">
          <CardBody p={8}>
            <StudentForm student={student} isEdit />
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}

