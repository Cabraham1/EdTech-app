'use client'

import { Box } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box display="flex" flex="1">
        <Sidebar />
        <Box
          as="main"
          flex="1"
          ml={{ base: 0, lg: '200px' }}
          display="flex"
          flexDirection="column"
        >
          {children}
          <Footer />
        </Box>
      </Box>
    </Box>
  )
}

