'use client'

import { useEffect, useState } from 'react'
import {
  Container,
  Heading,
  Box,
  Button,
  Card,
  CardBody,
  Text,
  Spinner,
  Center,
} from '@chakra-ui/react'
import Link from 'next/link'
import { StudentForm } from '@/components/StudentForm'
import { Student } from '@/lib/data/types'
import { useStudentStorage } from '@/lib/hooks/useStudentStorage'
import apiClient from '@/lib/api/client'

interface EditStudentPageProps {
  params: {
    id: string
  }
}

export default function EditStudentPage({
  params,
}: EditStudentPageProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getFromStorage } = useStudentStorage()

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // First check localStorage
        const storedStudents = getFromStorage()
        const localStudent = storedStudents.find((s) => s.id === params.id)
        
        if (localStudent) {
          setStudent(localStudent)
          setLoading(false)
        }

        // Then fetch from API (which will sync)
        const response = await apiClient.get(`/students/${params.id}`)
        if (response.data.student) {
          setStudent(response.data.student)
        }
      } catch (err: any) {
        console.error('Failed to load student:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  if (loading) {
    return (
      <Box
        bgGradient="linear(to-br, blue.50, purple.50)"
        minH="calc(100vh - 64px)"
        py={8}
      >
        <Container maxW="container.md">
          <Center py={20}>
            <Spinner size="xl" color="blue.500" />
          </Center>
        </Container>
      </Box>
    )
  }

  if (!student) {
    return (
      <Box
        bgGradient="linear(to-br, blue.50, purple.50)"
        minH="calc(100vh - 64px)"
        py={8}
      >
        <Container maxW="container.md">
          <Card bg="white" boxShadow="xl">
            <CardBody p={8} textAlign="center">
              <Heading size="xl" mb={4} color="red.500">
                404
              </Heading>
              <Text fontSize="lg" mb={6} color="gray.600">
                Student not found
              </Text>
              <Button
                as={Link}
                href="/students"
                colorScheme="blue"
                size="lg"
              >
                Go to Students List
              </Button>
            </CardBody>
          </Card>
        </Container>
      </Box>
    )
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

