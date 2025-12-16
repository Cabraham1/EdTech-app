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
    <Box
      bgGradient="linear(to-br, blue.50, purple.50)"
      minH="calc(100vh - 64px)"
      py={8}
    >
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Box>
              <Heading size="xl" mb={2} color="blue.600">
                Student Profile
              </Heading>
              <Text color="gray.600">View and manage student details</Text>
            </Box>
            <HStack>
              <Button
                as={Link}
                href={`/students/${params.id}/edit`}
                colorScheme="blue"
                size="md"
              >
                Edit
              </Button>
              <Button as={Link} href="/students" variant="outline" size="md">
                Back to List
              </Button>
            </HStack>
          </HStack>

          <Card bg="white" boxShadow="xl">
            <CardBody p={8}>
              <VStack spacing={6} align="stretch">
                <Box
                  pb={6}
                  borderBottom="2px"
                  borderColor="gray.100"
                >
                  <Text fontSize="sm" color="gray.500" mb={2} fontWeight="semibold">
                    FULL NAME
                  </Text>
                  <Heading size="lg" color="gray.800">
                    {student.name}
                  </Heading>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2} fontWeight="semibold">
                      REGISTRATION NUMBER
                    </Text>
                    <Text fontSize="xl" fontWeight="medium" color="gray.800">
                      {student.registrationNumber}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2} fontWeight="semibold">
                      MAJOR
                    </Text>
                    <Text fontSize="xl" fontWeight="medium" color="gray.800">
                      {student.major}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2} fontWeight="semibold">
                      DATE OF BIRTH
                    </Text>
                    <Text fontSize="xl" fontWeight="medium" color="gray.800">
                      {formatDate(student.dob)}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2} fontWeight="semibold">
                      GRADE POINT AVERAGE
                    </Text>
                    <Badge
                      colorScheme={
                        student.gpa >= 3.5
                          ? 'green'
                          : student.gpa >= 3.0
                          ? 'yellow'
                          : 'red'
                      }
                      fontSize="xl"
                      px={4}
                      py={2}
                      borderRadius="md"
                    >
                      {student.gpa.toFixed(2)}
                    </Badge>
                  </Box>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          <DeleteButton studentId={params.id} />
        </VStack>
      </Container>
    </Box>
  )
}

