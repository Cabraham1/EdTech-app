import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

