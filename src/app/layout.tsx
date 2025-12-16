import { Providers } from './providers'
import { AppLayout } from '@/components/AppLayout'
import './globals.css'

export const metadata = {
  title: 'Student Information Management System',
  description: 'Manage student records efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  )
}
