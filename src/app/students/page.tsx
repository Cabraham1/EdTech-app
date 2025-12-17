"use client";

import { useEffect, useState, useMemo } from "react";
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
} from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StudentCard } from "@/components/StudentCard";
import { SearchBar } from "@/components/SearchBar";
import { Student } from "@/lib/data/types";
import { useStudentStorage } from "@/lib/hooks/useStudentStorage";
import apiClient from "@/lib/api/client";

export default function StudentsPage() {
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { getFromStorage, syncToStorage } = useStudentStorage();

  const search = searchParams.get("search") || undefined;

  useEffect(() => {
    const fetchStudents = async () => {
      // Check localStorage first
      const storedStudents = getFromStorage();
      if (storedStudents.length > 0) {
        setStudents(storedStudents);
        setLoading(false);
      }

      // Fetch from API to sync
      try {
        const response = await apiClient.get("/students");
        if (response.data.students) {
          setStudents(response.data.students);
          syncToStorage(response.data.students);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerSearch) ||
          s.registrationNumber.includes(lowerSearch) ||
          s.major.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [students, search]);

  const avgGpa =
    students.length > 0
      ? students.reduce((sum, s) => sum + s.gpa, 0) / students.length
      : 0;

  if (loading) {
    return (
      <Box
        bgGradient="linear(to-r, blue.50, purple.50)"
        minH="calc(100vh - 64px)"
        py={8}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Box textAlign="center" py={20}>
              <Text fontSize="xl" color="gray.500">
                Loading students...
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      bgGradient="linear(to-r, blue.50, purple.50)"
      minH="calc(100vh - 64px)"
      py={8}
    >
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Box flex="1">
              <Heading size="xl" mb={2} color="blue.600">
                Student Directory
              </Heading>
              <Text color="gray.600">Manage and track student information</Text>
            </Box>
            <HStack spacing={4} flexWrap="wrap">
              <Box w={{ base: "full", md: "300px" }}>
                <SearchBar initialValue={search || ""} />
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
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Card bg="white" boxShadow="md">
              <CardBody>
                <Stat>
                  <StatLabel>Total Students</StatLabel>
                  <StatNumber>{students.length}</StatNumber>
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
                  <StatNumber>{filteredStudents.length}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {filteredStudents.length === 0 ? (
            <Card bg="white" boxShadow="md">
              <CardBody>
                <Box textAlign="center" py={12}>
                  <Text fontSize="xl" color="gray.500" mb={2}>
                    No students found
                  </Text>
                  <Text fontSize="md" color="gray.400">
                    {search
                      ? "Try adjusting your search."
                      : "Add your first student to get started."}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
