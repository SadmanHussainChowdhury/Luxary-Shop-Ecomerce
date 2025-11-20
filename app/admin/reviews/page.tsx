'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle, X, Eye } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')

  useEffect(() => {
    loadReviews()
  }, [filter])

  async function loadReviews() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/reviews?filter=${filter}`, { cache: 'no-store' })
      const data = await res.json()
      if (data.reviews) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  async function updateReviewStatus(reviewId: string, isApproved: boolean) {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      })

      if (!res.ok) {
        throw new Error('Failed to update review')
      }

      toast.success(`Review ${isApproved ? 'approved' : 'rejected'}`)
      loadReviews()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update review')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ocean-darkGray flex items-center gap-3">
          <Star size={32} />
          Review Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' ? 'bg-premium-gold text-white' : 'bg-ocean-lightest text-ocean-gray'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'approved' ? 'bg-premium-gold text-white' : 'bg-ocean-lightest text-ocean-gray'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'pending' ? 'bg-premium-gold text-white' : 'bg-ocean-lightest text-ocean-gray'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ocean-gray">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-ocean-gray">No reviews found</div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ocean-border rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-ocean-darkGray">{review.customerName}</h3>
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        <CheckCircle size={12} />
                        Verified Purchase
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${
                      review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        size={16}
                        className={
                          review.rating >= rating
                            ? 'text-premium-gold fill-premium-gold'
                            : 'text-ocean-border'
                        }
                      />
                    ))}
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-ocean-darkGray mb-2">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-ocean-gray mb-2">{review.comment}</p>
                  )}
                  <p className="text-sm text-ocean-gray">
                    Product: {review.productId?.title || review.productId}
                  </p>
                  <p className="text-sm text-ocean-gray">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!review.isApproved && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateReviewStatus(review._id, true)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      title="Approve"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review._id, false)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      title="Reject"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

