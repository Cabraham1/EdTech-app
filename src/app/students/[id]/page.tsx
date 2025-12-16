import {
  Container,
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Card,
  CardBody,
} from '@chakra-ui/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studentService } from '@/lib/services/studentService'
import { DeleteButton } from '@/components/DeleteButton'

interface StudentDetailPageProps {
  params: {
    id: string
  }
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  let student
  try {
    student = await studentService.getStudentById(params.id)
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      notFound()
    }
    throw error
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Heading size="lg">Student Profile</Heading>
          <HStack>
            <Button as={Link} href={`/students/${params.id}/edit`} colorScheme="blue">
              Edit
            </Button>
            <Button as={Link} href="/students" variant="outline">
              Back to List
            </Button>
          </HStack>
        </HStack>

        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Name
                </Text>
                <Heading size="md">{student.name}</Heading>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Registration Number
                </Text>
                <Text fontSize="lg">{student.registrationNumber}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Major
                </Text>
                <Text fontSize="lg">{student.major}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Date of Birth
                </Text>
                <Text fontSize="lg">{formatDate(student.dob)}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  GPA
                </Text>
                <Badge
                  colorScheme={
                    student.gpa >= 3.5
                      ? 'green'
                      : student.gpa >= 3.0
                      ? 'yellow'
                      : 'red'
                  }
                  fontSize="lg"
                  px={3}
                  py={1}
                >
                  {student.gpa.toFixed(2)}
                </Badge>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <DeleteButton studentId={params.id} />
      </VStack>
    </Container>
  )
}

