import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  Link,
} from '@chakra-ui/react'
import { Student } from '@/lib/data/types'

interface StudentCardProps {
  student: Student
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card
      as={Link}
      href={`/students/${student.id}`}
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <CardBody>
        <Heading size="md" mb={2}>
          {student.name}
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={1}>
          <strong>Reg No:</strong> {student.registrationNumber}
        </Text>
        <Text fontSize="sm" color="gray.600" mb={2}>
          <strong>Major:</strong> {student.major}
        </Text>
        <Badge
          colorScheme={student.gpa >= 3.5 ? 'green' : student.gpa >= 3.0 ? 'yellow' : 'red'}
          fontSize="sm"
        >
          GPA: {student.gpa.toFixed(2)}
        </Badge>
      </CardBody>
    </Card>
  )
}

