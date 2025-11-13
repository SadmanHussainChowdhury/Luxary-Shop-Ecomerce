'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, Lock } from 'lucide-react'

// Dynamic imports for Stripe React components to handle optional dependency
let Elements: any
let CardElement: any
let useStripe: any
let useElements: any

try {
  const stripeReact = require('@stripe/react-stripe-js')
  Elements = stripeReact.Elements
  CardElement = stripeReact.CardElement
  useStripe = stripeReact.useStripe
  useElements = stripeReact.useElements
} catch (e) {
  // Package not installed - will show fallback message
}

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null

interface StripeCardElementProps {
  clientSecret: string
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  disabled?: boolean
}

function CheckoutForm({ clientSecret, onPaymentSuccess, onPaymentError, disabled }: StripeCardElementProps) {
  const stripe = useStripe ? useStripe() : null
  const elements = useElements ? useElements() : null
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements || disabled) {
      return
    }

    setProcessing(true)
    setError(null)

    if (!CardElement || !elements) {
      setError('Stripe Elements not available')
      setProcessing(false)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Card element not found')
      setProcessing(false)
      return
    }

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        onPaymentError(confirmError.message || 'Payment failed')
        setProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id)
      } else {
        setError('Payment was not successful')
        onPaymentError('Payment was not successful')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      onPaymentError(err.message || 'An error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: 'system-ui, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: false,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border-2 border-ocean-border rounded-lg bg-white">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={18} className="text-premium-gold" />
          <span className="text-sm font-semibold text-ocean-darkGray">Card Information</span>
        </div>
        {CardElement ? (
          <CardElement options={cardElementOptions} />
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            Stripe package not installed. Please run: npm install @stripe/react-stripe-js
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || disabled}
        className="w-full bg-gradient-to-r from-premium-gold to-premium-amber text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock size={18} />
            Pay Securely
          </>
        )}
      </button>
      
      <p className="text-xs text-ocean-gray text-center flex items-center justify-center gap-1">
        <Lock size={12} />
        Your payment information is secure and encrypted
      </p>
    </form>
  )
}

export default function StripeCardElement({ clientSecret, onPaymentSuccess, onPaymentError, disabled }: StripeCardElementProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-4 border-2 border-ocean-border rounded-lg bg-yellow-50">
        <p className="text-sm text-yellow-800">
          Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.
        </p>
      </div>
    )
  }

  if (!Elements || !stripePromise) {
    return (
      <div className="p-4 border-2 border-ocean-border rounded-lg bg-yellow-50">
        <p className="text-sm text-yellow-800">
          Stripe package not installed. Please run: <code className="bg-yellow-100 px-2 py-1 rounded">npm install @stripe/react-stripe-js</code>
        </p>
      </div>
    )
  }

  const options: any = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        clientSecret={clientSecret}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        disabled={disabled}
      />
    </Elements>
  )
}

