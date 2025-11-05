import Link from 'next/link'
import { Search, MessageCircle, Phone, Mail, HelpCircle, Shield, Truck, CreditCard, RotateCcw } from 'lucide-react'

export const metadata = {
  title: 'Help Center - Luxury Shop',
  description: 'Get help with your orders, shipping, returns, and more.',
}

export default function HelpCenterPage() {
  const helpCategories = [
    {
      icon: Truck,
      title: 'Orders & Shipping',
      topics: [
        'How to track your order',
        'Shipping information',
        'Delivery times',
        'International shipping',
      ],
    },
    {
      icon: RotateCcw,
      title: 'Returns & Refunds',
      topics: [
        'Return policy',
        'How to return an item',
        'Refund process',
        'Exchange policy',
      ],
    },
    {
      icon: CreditCard,
      title: 'Payment & Billing',
      topics: [
        'Payment methods',
        'Billing questions',
        'Promo codes',
        'Payment security',
      ],
    },
    {
      icon: Shield,
      title: 'Account & Security',
      topics: [
        'Account management',
        'Password reset',
        'Privacy settings',
        'Security tips',
      ],
    },
  ]

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight shipping are also available.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all items. Items must be unused and in original packaging with tags attached.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates and times vary by location.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order in your account dashboard.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard SSL encryption and never store your full credit card information on our servers.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ocean-darkGray mb-4">
            Help Center
          </h1>
          <p className="text-xl text-ocean-gray max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-gray" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 border-2 border-ocean-border rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {helpCategories.map((category, i) => {
            const Icon = category.icon
            return (
              <div
                key={i}
                className="bg-white border border-ocean-border rounded-xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="p-3 bg-premium-gold/10 rounded-lg w-fit mb-4">
                  <Icon size={24} className="text-premium-gold" />
                </div>
                <h3 className="text-xl font-bold text-ocean-darkGray mb-3">{category.title}</h3>
                <ul className="space-y-2">
                  {category.topics.map((topic, j) => (
                    <li key={j}>
                      <Link
                        href="/help"
                        className="text-ocean-gray hover:text-premium-gold transition-colors text-sm"
                      >
                        {topic}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-ocean-darkGray mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-ocean-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-ocean-darkGray mb-2 flex items-center gap-2">
                  <HelpCircle size={20} className="text-premium-gold" />
                  {faq.question}
                </h3>
                <p className="text-ocean-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="bg-gradient-to-r from-premium-gold to-premium-amber rounded-2xl p-8 text-white max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Still Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/contact"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition text-center"
            >
              <MessageCircle size={32} className="mx-auto mb-3" />
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-sm text-white/80">Chat with us now</p>
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition text-center"
            >
              <Phone size={32} className="mx-auto mb-3" />
              <h3 className="font-bold mb-2">Call Us</h3>
              <p className="text-sm text-white/80">+1 (555) 123-4567</p>
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition text-center"
            >
              <Mail size={32} className="mx-auto mb-3" />
              <h3 className="font-bold mb-2">Email Us</h3>
              <p className="text-sm text-white/80">support@luxuryshop.com</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

