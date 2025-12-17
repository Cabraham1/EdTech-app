'use client'

import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from '@/lib/hooks/useDebouncedCallback'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  initialValue?: string
}

export function SearchBar({ initialValue = '' }: SearchBarProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(initialValue)

  useEffect(() => {
    setSearchValue(initialValue)
  }, [initialValue])

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.push(`/students?${params.toString()}`)
  }, 300)

  return (
    <InputGroup size="md">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Search by name, reg number, or major..."
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value)
          handleSearch(e.target.value)
        }}
        bg="white"
        size="md"
      />
    </InputGroup>
  )
}

