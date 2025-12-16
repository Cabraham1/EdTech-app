import {
  Box,
  Container,
  Flex,
  Text,
  HStack,
  Link,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'

export function Footer() {
  const bg = useColorModeValue('gray.50', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box as="footer" bg={bg} borderTop="1px" borderColor={borderColor} mt="auto">
      <Container maxW="container.xl" py={8}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text color={textColor} fontSize="sm">
            © {new Date().getFullYear()} Student Information Management System.
            All rights reserved.
          </Text>
          <HStack spacing={6}>
            <Link href="/students" fontSize="sm" color={textColor}>
              Students
            </Link>
            <Link href="/students/new" fontSize="sm" color={textColor}>
              Add Student
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

