'use client'

import { HStack, Input, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface FilterControlsProps {
  initialMinGpa?: string
  initialMaxGpa?: string
}

export function FilterControls({
  initialMinGpa = '',
  initialMaxGpa = '',
}: FilterControlsProps) {
  const router = useRouter()
  const [minGpa, setMinGpa] = useState(initialMinGpa)
  const [maxGpa, setMaxGpa] = useState(initialMaxGpa)

  useEffect(() => {
    setMinGpa(initialMinGpa)
    setMaxGpa(initialMaxGpa)
  }, [initialMinGpa, initialMaxGpa])

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search)
    
    if (minGpa) {
      params.set('minGpa', minGpa)
    } else {
      params.delete('minGpa')
    }
    
    if (maxGpa) {
      params.set('maxGpa', maxGpa)
    } else {
      params.delete('maxGpa')
    }
    
    router.push(`/students?${params.toString()}`)
  }

  const clearFilters = () => {
    setMinGpa('')
    setMaxGpa('')
    router.push('/students')
  }

  return (
    <HStack spacing={4} align="end" flexWrap="wrap">
      <Text fontSize="sm" fontWeight="medium" color="gray.700">
        GPA Range:
      </Text>
      <Input
        type="number"
        placeholder="Min GPA"
        value={minGpa}
        onChange={(e) => setMinGpa(e.target.value)}
        size="sm"
        w="120px"
        bg="white"
        min="0"
        max="4"
        step="0.1"
      />
      <Text fontSize="sm" color="gray.500">
        to
      </Text>
      <Input
        type="number"
        placeholder="Max GPA"
        value={maxGpa}
        onChange={(e) => setMaxGpa(e.target.value)}
        size="sm"
        w="120px"
        bg="white"
        min="0"
        max="4"
        step="0.1"
      />
      <Button size="sm" colorScheme="blue" onClick={applyFilters}>
        Apply
      </Button>
      {(minGpa || maxGpa) && (
        <Button size="sm" variant="ghost" onClick={clearFilters}>
          Clear
        </Button>
      )}
    </HStack>
  )
}

