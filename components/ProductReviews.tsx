'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, CheckCircle, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Review {
  _id: string
  customerName: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  isVerifiedPurchase?: boolean
  helpfulCount?: number
  createdAt: string
}

interface ProductReviewsProps {
  productId?: string
  productSlug?: string
  productTitle?: string
}

export default function ProductReviews({ productId, productSlug, productTitle }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    comment: '',
  })

  useEffect(() => {
    loadReviews()
  }, [productId, productSlug])

  async function loadReviews() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (productId) params.set('productId', productId)
      if (productSlug) params.set('productSlug', productSlug)

      const res = await fetch(`/api/reviews?${params.toString()}`)
      const data = await res.json()
      if (data.reviews) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.customerName || !formData.customerEmail || !formData.rating) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productSlug,
          ...formData,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      toast.success('Review submitted successfully!')
      setShowForm(false)
      setFormData({
        customerName: '',
        customerEmail: '',
        rating: 5,
        title: '',
        comment: '',
      })
      loadReviews()
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-ocean-gray">Loading reviews...</div>
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ocean-darkGray">
          Customer Reviews ({reviews.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-premium-gold text-white rounded-lg hover:bg-premium-amber transition"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ocean-border rounded-xl p-6 mb-6"
        >
          <h3 className="text-xl font-bold text-ocean-darkGray mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className={`p-2 rounded ${
                      formData.rating >= rating
                        ? 'text-premium-gold'
                        : 'text-ocean-border'
                    }`}
                  >
                    <Star
                      size={24}
                      fill={formData.rating >= rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summarize your experience"
                className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-darkGray mb-2">
                Your Review
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-2 border border-ocean-border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-premium-gold text-white rounded-lg hover:bg-premium-amber transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-ocean-gray">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ocean-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-ocean-darkGray">{review.customerName}</h4>
                      {review.isVerifiedPurchase && (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          <CheckCircle size={12} />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
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
                  </div>
                </div>
                <span className="text-sm text-ocean-gray">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.title && (
                <h5 className="font-semibold text-ocean-darkGray mb-2">{review.title}</h5>
              )}
              {review.comment && (
                <p className="text-ocean-gray mb-3">{review.comment}</p>
              )}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      className="w-20 h-20 rounded object-cover"
                    />
                  ))}
                </div>
              )}
              {review.helpfulCount !== undefined && (
                <button className="flex items-center gap-2 text-sm text-ocean-gray hover:text-premium-gold transition">
                  <ThumbsUp size={16} />
                  Helpful ({review.helpfulCount})
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

