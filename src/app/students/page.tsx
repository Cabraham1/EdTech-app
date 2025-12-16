import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { studentService } from '@/lib/services/studentService'
import { StudentCard } from '@/components/StudentCard'
import { SearchBar } from '@/components/SearchBar'
import { FilterControls } from '@/components/FilterControls'

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

  const students = await studentService.getAllStudents(search, minGpa, maxGpa)

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
          <Heading size="lg">Student Directory</Heading>
          <Button as={Link} href="/students/new" colorScheme="blue">
            Add New Student
          </Button>
        </Box>

        <VStack spacing={4} align="stretch">
          <SearchBar initialValue={search || ''} />
          <FilterControls
            initialMinGpa={searchParams.minGpa || ''}
            initialMaxGpa={searchParams.maxGpa || ''}
          />
        </VStack>

        {students.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              No students found. {search || minGpa || maxGpa ? 'Try adjusting your filters.' : 'Add your first student to get started.'}
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  )
}

