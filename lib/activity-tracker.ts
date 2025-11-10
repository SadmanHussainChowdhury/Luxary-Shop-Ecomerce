// Customer Activity Tracker
// Tracks customer activities when signed in

const ACTIVITY_STORAGE_KEY_PREFIX = 'worldclass_customer_activity_'
const MAX_ACTIVITIES = 100 // Keep last 100 activities

function getActivityStorageKey(): string {
  if (typeof window === 'undefined') return ''
  const profileRaw = localStorage.getItem('worldclass_profile_v1')
  if (!profileRaw) return ''
  try {
    const profile = JSON.parse(profileRaw)
    const email = profile?.email || ''
    if (!email) return ''
    // Create a user-specific key based on email
    return `${ACTIVITY_STORAGE_KEY_PREFIX}${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  } catch {
    return ''
  }
}

export type ActivityType = 
  | 'sign_in'
  | 'sign_out'
  | 'page_view'
  | 'product_view'
  | 'cart_add'
  | 'cart_remove'
  | 'wishlist_add'
  | 'wishlist_remove'
  | 'search'
  | 'order_placed'
  | 'checkout_started'

export interface Activity {
  id: string
  type: ActivityType
  timestamp: string
  details?: {
    page?: string
    productSlug?: string
    productTitle?: string
    searchQuery?: string
    orderId?: string
    orderTotal?: number
    [key: string]: any
  }
}

function isSignedIn(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('worldclass_signed_in') === 'true'
}

export function trackActivity(type: ActivityType, details?: Activity['details']) {
  if (typeof window === 'undefined') return
  if (!isSignedIn()) return

  try {
    const storageKey = getActivityStorageKey()
    if (!storageKey) return

    const activities: Activity[] = JSON.parse(
      localStorage.getItem(storageKey) || '[]'
    )

    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      details,
    }

    // Add to beginning and keep only last MAX_ACTIVITIES
    activities.unshift(newActivity)
    const trimmed = activities.slice(0, MAX_ACTIVITIES)

    localStorage.setItem(storageKey, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Failed to track activity:', error)
  }
}

export function getActivities(limit?: number): Activity[] {
  if (typeof window === 'undefined') return []
  if (!isSignedIn()) return []

  try {
    const storageKey = getActivityStorageKey()
    if (!storageKey) return []

    const activities: Activity[] = JSON.parse(
      localStorage.getItem(storageKey) || '[]'
    )
    return limit ? activities.slice(0, limit) : activities
  } catch (error) {
    console.error('Failed to load activities:', error)
    return []
  }
}

export function clearActivities() {
  if (typeof window === 'undefined') return
  try {
    const storageKey = getActivityStorageKey()
    if (storageKey) {
      localStorage.removeItem(storageKey)
    }
  } catch (error) {
    console.error('Failed to clear activities:', error)
  }
}

export function clearAllUserActivities() {
  if (typeof window === 'undefined') return
  try {
    // Clear all activity keys for all users
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(ACTIVITY_STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Failed to clear all activities:', error)
  }
}

export function getActivityStats() {
  const activities = getActivities()
  const stats = {
    total: activities.length,
    signIns: activities.filter(a => a.type === 'sign_in').length,
    productViews: activities.filter(a => a.type === 'product_view').length,
    cartAdds: activities.filter(a => a.type === 'cart_add').length,
    orders: activities.filter(a => a.type === 'order_placed').length,
    searches: activities.filter(a => a.type === 'search').length,
    lastActivity: activities[0]?.timestamp || null,
  }
  return stats
}

