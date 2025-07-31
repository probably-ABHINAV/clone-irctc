"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { TrainSearch } from "@/components/train-search"
import { TrainSearchResults } from "@/components/train-search-results"

export interface SearchParams {
  fromStation: string
  toStation: string
  date: string
  travelClass: string
  passengers: string
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const urlParams = useSearchParams()

  // Load search parameters from URL on page load - use useCallback to prevent infinite loops
  const loadUrlParams = useCallback(() => {
    const from = urlParams.get("from")
    const to = urlParams.get("to")
    const date = urlParams.get("date")
    const travelClass = urlParams.get("class") || ""
    const passengers = urlParams.get("passengers") || "1"

    if (from && to && date) {
      const params: SearchParams = {
        fromStation: from,
        toStation: to,
        date,
        travelClass,
        passengers,
      }

      // Only update if params are different to prevent infinite loops
      setSearchParams((prevParams) => {
        if (
          !prevParams ||
          prevParams.fromStation !== params.fromStation ||
          prevParams.toStation !== params.toStation ||
          prevParams.date !== params.date ||
          prevParams.travelClass !== params.travelClass ||
          prevParams.passengers !== params.passengers
        ) {
          return params
        }
        return prevParams
      })
    }
  }, [urlParams])

  useEffect(() => {
    loadUrlParams()
  }, [loadUrlParams])

  const handleSearch = useCallback(async (params: any) => {
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
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <TrainSearch onSearch={handleSearch} isSearching={isSearching} showResults={true} />
      </div>

      {searchParams && <TrainSearchResults searchParams={searchParams} isLoading={isSearching} />}
    </div>
  )
}
