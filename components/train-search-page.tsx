"use client"

import { useState } from "react"
import { TrainSearch } from "@/components/train-search"
import { TrainSearchResults } from "@/components/train-search-results"

export interface SearchParams {
  fromStation: string
  toStation: string
  date: string
  travelClass: string
  passengers: string
}

export function TrainSearchPage() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (params: any) => {
    setIsSearching(true)

    const searchData: SearchParams = {
      fromStation: params.fromStation,
      toStation: params.toStation,
      date: params.date,
      travelClass: params.travelClass || "",
      passengers: params.passengers || "1",
    }

    setSearchParams(searchData)

    // Simulate API call delay
    setTimeout(() => {
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <TrainSearch onSearch={handleSearch} isSearching={isSearching} />
      </div>

      {searchParams && <TrainSearchResults searchParams={searchParams} isLoading={isSearching} />}
    </div>
  )
}
