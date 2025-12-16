'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/lib/contexts/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  )
}

