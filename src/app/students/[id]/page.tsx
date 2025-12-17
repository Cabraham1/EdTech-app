"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  SimpleGrid,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { DeleteButton } from "@/components/DeleteButton";
import { Student } from "@/lib/data/types";
import { useStudentStorage } from "@/lib/hooks/useStudentStorage";

interface StudentDetailPageProps {
  params: {
    id: string;
  };
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getFromStorage, getStorageHeader } = useStudentStorage();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // First check localStorage
        const storedStudents = getFromStorage();
        const localStudent = storedStudents.find((s) => s.id === params.id);

        if (localStudent) {
          setStudent(localStudent);
          setLoading(false);
        }

        // Then fetch from API (which will sync)
        const headers: Record<string, string> = {
          ...getStorageHeader(),
        };

        const response = await fetch(`/api/students/${params.id}`, {
          headers,
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Student not found");
            setLoading(false);
            return;
          }
          throw new Error("Failed to fetch student");
        }

        const result = await response.json();
        if (result.student) {
          setStudent(result.student);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load student");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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
    );
  }

  if (error || !student) {
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
                Page not found
              </Text>
              <Button as={Link} href="/students" colorScheme="blue" size="lg">
                Go to Students List
              </Button>
            </CardBody>
          </Card>
        </Container>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                <Box pb={6} borderBottom="2px" borderColor="gray.100">
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    mb={2}
                    fontWeight="semibold"
                  >
                    FULL NAME
                  </Text>
                  <Heading size="lg" color="gray.800">
                    {student.name}
                  </Heading>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      mb={2}
                      fontWeight="semibold"
                    >
                      REGISTRATION NUMBER
                    </Text>
                    <Text fontSize="xl" fontWeight="medium" color="gray.800">
                      {student.registrationNumber}
                    </Text>
                  </Box>

                  <Box>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      mb={2}
                      fontWeight="semibold"
                    >
                      MAJOR
                    </Text>
                    <Text fontSize="xl" fontWeight="medium" color="gray.800">
                      {student.major}
                    </Text>
                  </Box>

                  <Box>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      mb={2}
                      fontWeight="semibold"
                    >
                      DATE OF BIRTH
                    </Text>
                    <Text fontSize="xl" fontWeight="medium" color="gray.800">
                      {formatDate(student.dob)}
                    </Text>
                  </Box>

                  <Box>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      mb={2}
                      fontWeight="semibold"
                    >
                      GRADE POINT AVERAGE
                    </Text>
                    <Badge
                      colorScheme={
                        student.gpa >= 3.5
                          ? "green"
                          : student.gpa >= 3.0
                          ? "yellow"
                          : "red"
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
  );
}
