import {
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  Link,
  VStack,
  HStack,
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
      bg="white"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl',
        borderColor: 'blue.300',
      }}
      transition="all 0.3s"
      cursor="pointer"
      border="2px"
      borderColor="transparent"
      boxShadow="md"
    >
      <CardBody p={6}>
        <Heading size="lg" mb={3} color="gray.800">
          {student.name}
        </Heading>
        <VStack spacing={2} align="stretch" mb={4}>
          <HStack>
            <Text fontSize="xs" color="gray.500" fontWeight="semibold" minW="100px">
              Reg No:
            </Text>
            <Text fontSize="sm" color="gray.700" fontWeight="medium">
              {student.registrationNumber}
            </Text>
          </HStack>
          <HStack>
            <Text fontSize="xs" color="gray.500" fontWeight="semibold" minW="100px">
              Major:
            </Text>
            <Text fontSize="sm" color="gray.700" fontWeight="medium">
              {student.major}
            </Text>
          </HStack>
        </VStack>
        <Badge
          colorScheme={
            student.gpa >= 3.5 ? 'green' : student.gpa >= 3.0 ? 'yellow' : 'red'
          }
          fontSize="md"
          px={3}
          py={1}
          borderRadius="md"
          width="fit-content"
        >
          GPA: {student.gpa.toFixed(2)}
        </Badge>
      </CardBody>
    </Card>
  )
}

