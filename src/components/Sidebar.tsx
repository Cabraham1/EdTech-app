'use client'

import {
  Box,
  VStack,
  Button,
  useColorModeValue,
  Text,
  Divider,
} from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'

interface NavItem {
  label: string
  href: string
  icon?: string
}

const navItems: NavItem[] = [
  { label: 'Students', href: '/students' },
  { label: 'Add Student', href: '/students/new' },
]

export function Sidebar() {
  const pathname = usePathname()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { user } = useAuth()

  if (!user) return null

  return (
    <Box
      as="aside"
      w={{ base: 'full', md: '250px' }}
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      p={4}
      display={{ base: 'none', lg: 'block' }}
      position="sticky"
      top="64px"
      height="calc(100vh - 64px)"
      overflowY="auto"
    >
      <VStack spacing={2} align="stretch">
        <Text fontSize="xs" fontWeight="bold" color="gray.500" px={2} py={2}>
          NAVIGATION
        </Text>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Button
              key={item.href}
              as={Link}
              href={item.href}
              variant={isActive ? 'solid' : 'ghost'}
              colorScheme={isActive ? 'blue' : 'gray'}
              justifyContent="flex-start"
              leftIcon={item.icon ? <Text>{item.icon}</Text> : undefined}
            >
              {item.label}
            </Button>
          )
        })}
      </VStack>
    </Box>
  )
}

