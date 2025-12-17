"use client";

import {
  Container,
  Heading,
  Box,
  Button,
  Card,
  CardBody,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { StudentForm } from "@/components/StudentForm";

export default function NewStudentPage() {
  return (
    <Box
      bgGradient="linear(to-br, blue.50, purple.50)"
      minH="calc(100vh - 64px)"
      py={8}
    >
      <Container maxW="container.md">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={6}
        >
          <Box>
            <Heading size="xl" mb={2} color="blue.600">
              Add New Student
            </Heading>
            <Text color="gray.600">Create a new student record</Text>
          </Box>
          <Button as={Link} href="/students" variant="outline" size="md">
            Back to List
          </Button>
        </Box>

        <Card bg="white" boxShadow="xl">
          <CardBody p={8}>
            <StudentForm />
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
