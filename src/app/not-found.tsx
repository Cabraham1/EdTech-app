import { Container, Heading, Text, Button, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Container maxW="container.md" py={16}>
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl">404</Heading>
        <Text fontSize="xl" color="gray.600">
          Page not found
        </Text>
        <Button as={Link} href="/students" colorScheme="blue">
          Go to Students List
        </Button>
      </VStack>
    </Container>
  )
}

