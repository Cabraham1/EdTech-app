'use client'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Student, StudentInput } from '@/lib/data/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useStudentStorage } from '@/lib/hooks/useStudentStorage'
import apiClient from '@/lib/api/client'

interface StudentFormProps {
  student?: Student
  isEdit?: boolean
}

export function StudentForm({ student, isEdit = false }: StudentFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { syncToStorage } = useStudentStorage()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentInput>({
    defaultValues: student
      ? {
          name: student.name,
          registrationNumber: student.registrationNumber,
          major: student.major,
          dob: student.dob,
          gpa: student.gpa,
        }
      : undefined,
  })

  const onSubmit = async (data: StudentInput) => {
    setIsSubmitting(true)
    try {
      const url = isEdit ? `/students/${student!.id}` : '/students'
      const response = isEdit
        ? await apiClient.put(url, data)
        : await apiClient.post(url, data)

      if (response.data.allStudents) {
        syncToStorage(response.data.allStudents)
      }

      toast({
        title: 'Success',
        description: isEdit
          ? 'Student updated successfully'
          : 'Student created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push(`/students/${response.data.student.id}`)
      router.refresh()
    } catch (error: any) {
      if (error.response?.data?.details) {
        Object.keys(error.response.data.details).forEach((field) => {
          toast({
            title: 'Validation Error',
            description: error.response.data.details[field][0],
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        })
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'An unexpected error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
              maxLength: {
                value: 100,
                message: 'Name must not exceed 100 characters',
              },
            })}
            bg="white"
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.registrationNumber}>
          <FormLabel>Registration Number</FormLabel>
          <Input
            {...register('registrationNumber', {
              required: 'Registration number is required',
              pattern: {
                value: /^\d{9}$/,
                message: 'Registration number must be 9 digits (e.g., 202401234)',
              },
            })}
            bg="white"
          />
          <FormErrorMessage>
            {errors.registrationNumber && errors.registrationNumber.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.major}>
          <FormLabel>Major</FormLabel>
          <Input
            {...register('major', {
              required: 'Major is required',
              minLength: {
                value: 2,
                message: 'Major must be at least 2 characters',
              },
              maxLength: {
                value: 100,
                message: 'Major must not exceed 100 characters',
              },
            })}
            bg="white"
          />
          <FormErrorMessage>
            {errors.major && errors.major.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.dob}>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            {...register('dob', {
              required: 'Date of birth is required',
              validate: (value) => {
                const dob = new Date(value)
                const today = new Date()
                const age = today.getFullYear() - dob.getFullYear()
                const monthDiff = today.getMonth() - dob.getMonth()
                if (dob > today) {
                  return 'Date of birth cannot be in the future'
                }
                if (age < 16 || (age === 16 && monthDiff < 0)) {
                  return 'Student must be at least 16 years old'
                }
                return true
              },
            })}
            bg="white"
          />
          <FormErrorMessage>
            {errors.dob && errors.dob.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.gpa}>
          <FormLabel>GPA</FormLabel>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="4"
            {...register('gpa', {
              required: 'GPA is required',
              min: {
                value: 0,
                message: 'GPA must be at least 0.0',
              },
              max: {
                value: 4,
                message: 'GPA must not exceed 4.0',
              },
              valueAsNumber: true,
            })}
            bg="white"
          />
          <FormErrorMessage>
            {errors.gpa && errors.gpa.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText={isEdit ? 'Updating...' : 'Creating...'}
        >
          {isEdit ? 'Update Student' : 'Create Student'}
        </Button>
      </VStack>
    </form>
  )
}

