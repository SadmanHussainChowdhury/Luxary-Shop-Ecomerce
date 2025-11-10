'use client'

import { useEffect } from 'react'
import { trackActivity } from '@/lib/activity-tracker'

export default function ProductViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const STORAGE_KEY = 'worldclass_recent_viewed_v1'
      const recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const updated = [slug, ...recent.filter((s: string) => s !== slug)].slice(0, 10)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      
      // Track product view activity
      trackActivity('product_view', {
        productSlug: slug,
        page: window.location.pathname,
      })
    } catch (error) {
      console.error('Failed to track product view:', error)
    }
  }, [slug])

  return null
}

