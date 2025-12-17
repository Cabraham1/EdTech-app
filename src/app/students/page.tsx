import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Button,
  VStack,
  Text,
  Card,
  CardBody,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react'
import Link from 'next/link'
import { studentService } from '@/lib/services/studentService'
import { StudentCard } from '@/components/StudentCard'
import { SearchBar } from '@/components/SearchBar'
import { FilterControls } from '@/components/FilterControls'
import { StudentStorageSync } from '@/components/StudentStorageSync'

interface StudentsPageProps {
  searchParams: {
    search?: string
    minGpa?: string
    maxGpa?: string
  }
}

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const search = searchParams.search
  const minGpa = searchParams.minGpa ? parseFloat(searchParams.minGpa) : undefined
  const maxGpa = searchParams.maxGpa ? parseFloat(searchParams.maxGpa) : undefined

  const allStudents = await studentService.getAllStudents()
  const students = await studentService.getAllStudents(search, minGpa, maxGpa)
  
  const avgGpa = allStudents.length > 0
    ? allStudents.reduce((sum, s) => sum + s.gpa, 0) / allStudents.length
    : 0

  return (
    <Box bgGradient="linear(to-r, blue.50, purple.50)" minH="calc(100vh - 64px)" py={8}>
      <StudentStorageSync />
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Box>
              <Heading size="xl" mb={2} color="blue.600">
                Student Directory
              </Heading>
              <Text color="gray.600">
                Manage and track student information
              </Text>
            </Box>
            <Button
              as={Link}
              href="/students/new"
              colorScheme="blue"
              size="lg"
              boxShadow="md"
            >
              + Add New Student
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Card bg="white" boxShadow="md">
              <CardBody>
                <Stat>
                  <StatLabel>Total Students</StatLabel>
                  <StatNumber>{allStudents.length}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg="white" boxShadow="md">
              <CardBody>
                <Stat>
                  <StatLabel>Average GPA</StatLabel>
                  <StatNumber>{avgGpa.toFixed(2)}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg="white" boxShadow="md">
              <CardBody>
                <Stat>
                  <StatLabel>Filtered Results</StatLabel>
                  <StatNumber>{students.length}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card bg="white" boxShadow="lg" p={6}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <SearchBar initialValue={search || ''} />
                <FilterControls
                  initialMinGpa={searchParams.minGpa || ''}
                  initialMaxGpa={searchParams.maxGpa || ''}
                />
              </VStack>
            </CardBody>
          </Card>

          {students.length === 0 ? (
            <Card bg="white" boxShadow="md">
              <CardBody>
                <Box textAlign="center" py={12}>
                  <Text fontSize="xl" color="gray.500" mb={2}>
                    No students found
                  </Text>
                  <Text fontSize="md" color="gray.400">
                    {search || minGpa || maxGpa
                      ? 'Try adjusting your filters.'
                      : 'Add your first student to get started.'}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

