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

  const isActive = (href: string) => {
    if (href === '/students') {
      return pathname === '/students' || 
             (pathname.startsWith('/students/') && 
              !pathname.startsWith('/students/new'))
    }
    if (href === '/students/new') {
      return pathname === '/students/new'
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <Box
      as="aside"
      w={{ base: 'full', md: '180px' }}
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      p={3}
      display={{ base: 'none', lg: 'block' }}
      position="sticky"
      top="64px"
      height="calc(100vh - 64px)"
      overflowY="auto"
    >
      <VStack spacing={2} align="stretch">
        <Text fontSize="xs" fontWeight="bold" color="gray.500" px={2} py={1}>
          NAVIGATION
        </Text>
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Button
              key={item.href}
              as={Link}
              href={item.href}
              variant={active ? 'solid' : 'ghost'}
              colorScheme={active ? 'blue' : 'gray'}
              justifyContent="flex-start"
              size="sm"
              fontSize="sm"
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

