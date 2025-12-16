import { Providers } from './providers'
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

