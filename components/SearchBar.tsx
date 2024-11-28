'use client'
import { scrapeAndStoreProduct } from '@/lib/actions'
import React, { useState } from 'react'
const isValidAmazonProductURL = (url: string) => {
  try {
    // console.log(url)
    const parseUrl = new URL(url)
    console.log(parseUrl)
    const hostname = parseUrl.hostname
    console.log(hostname)
    if (hostname.includes("amazon.com") || hostname.includes("amazon.") || hostname.endsWith("amazon")) return true
  } catch (error) {
    console.log(error)
    return false

  }
  return false
}
const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    console.log(searchPrompt)
    const isValidLink = isValidAmazonProductURL(searchPrompt)
    console.log(isValidLink)
    // alert(isValidLink ? "Valid Link" : "Invalid Link")
    try {
      setIsLoading(true)
      const product = await scrapeAndStoreProduct(searchPrompt)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <form
      className='flex flex-wrap gap-4 mt-12'
      onSubmit={handleSubmit}
    >
      <input className='searchbar-input ' type='text' placeholder='enter product link' value={searchPrompt} onChange={(e) => setSearchPrompt(e.target.value)} />
      <button
        type='submit'
        className='searchbar-btn'
      // disabled={searchPrompt.length === 0 ? true : false}

      >{isLoading ? "Searching..." : "Search"}</button>

    </form>
  )
}

export default SearchBar