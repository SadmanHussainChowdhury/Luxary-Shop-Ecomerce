// Customer Activity Tracker
// Tracks customer activities when signed in

const ACTIVITY_STORAGE_KEY = 'worldclass_customer_activity_v1'
const MAX_ACTIVITIES = 100 // Keep last 100 activities

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
    const activities: Activity[] = JSON.parse(
      localStorage.getItem(ACTIVITY_STORAGE_KEY) || '[]'
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

    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Failed to track activity:', error)
  }
}

export function getActivities(limit?: number): Activity[] {
  if (typeof window === 'undefined') return []
  if (!isSignedIn()) return []

  try {
    const activities: Activity[] = JSON.parse(
      localStorage.getItem(ACTIVITY_STORAGE_KEY) || '[]'
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
    localStorage.removeItem(ACTIVITY_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear activities:', error)
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

