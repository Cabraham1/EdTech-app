import {
  Container,
  Heading,
  Box,
  Button,
  Card,
  CardBody,
} from '@chakra-ui/react'
import Link from 'next/link'
import { StudentForm } from '@/components/StudentForm'

export default function NewStudentPage() {
  return (
    <Container maxW="container.md" py={8}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Add New Student</Heading>
        <Button as={Link} href="/students" variant="outline">
          Back to List
        </Button>
      </Box>

      <Card>
        <CardBody>
          <StudentForm />
        </CardBody>
      </Card>
    </Container>
  )
}

