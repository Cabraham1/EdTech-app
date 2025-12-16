'use client'

import {
  Box,
  Flex,
  Heading,
  Button,
  HStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <Box
      as="header"
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Flex maxW="container.xl" mx="auto" justify="space-between" align="center">
        <HStack spacing={8}>
          <Link href="/students">
            <Heading size="md" color="blue.600" cursor="pointer">
              EdTech SIMS
            </Heading>
          </Link>
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Button
              as={Link}
              href="/students"
              variant="ghost"
              colorScheme="blue"
            >
              Students
            </Button>
            <Button
              as={Link}
              href="/students/new"
              variant="ghost"
              colorScheme="blue"
            >
              Add Student
            </Button>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                leftIcon={<Avatar size="sm" name={user.email} />}
                rightIcon={<Box />}
              >
                <Text display={{ base: 'none', md: 'block' }}>{user.email}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button as={Link} href="/login" colorScheme="blue">
              Login
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}

