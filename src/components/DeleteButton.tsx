'use client'

import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useStudentStorage } from '@/lib/hooks/useStudentStorage'

interface DeleteButtonProps {
  studentId: string
}

export function DeleteButton({ studentId }: DeleteButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const toast = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const { getStorageHeader, syncToStorage } = useStudentStorage()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const headers: Record<string, string> = {
        ...getStorageHeader(),
      }

      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete student')
      }

      if (result.allStudents) {
        syncToStorage(result.allStudents)
      }

      toast({
        title: 'Success',
        description: 'Student deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/students')
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Delete Student
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Student
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isDeleting}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

