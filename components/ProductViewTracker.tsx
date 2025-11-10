'use client'

import { useEffect } from 'react'

export default function ProductViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const STORAGE_KEY = 'worldclass_recent_viewed_v1'
      const recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const updated = [slug, ...recent.filter((s: string) => s !== slug)].slice(0, 10)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to track product view:', error)
    }
  }, [slug])

  return null
}

