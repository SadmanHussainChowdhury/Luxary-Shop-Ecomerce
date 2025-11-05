import { Eye, Keyboard, MousePointer, Volume2, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Accessibility - Luxury Shop',
  description: 'Accessibility statement for Luxury Shop.',
}

export default function AccessibilityPage() {
  const features = [
    {
      icon: Keyboard,
      title: 'Keyboard Navigation',
      desc: 'All pages are fully navigable using only a keyboard.',
    },
    {
      icon: Eye,
      title: 'Screen Reader Support',
      desc: 'Our site is compatible with screen readers and assistive technologies.',
    },
    {
      icon: MousePointer,
      title: 'Clear Focus Indicators',
      desc: 'Visible focus indicators help users navigate through interactive elements.',
    },
    {
      icon: Volume2,
      title: 'Alt Text on Images',
      desc: 'All images include descriptive alternative text for better accessibility.',
    },
  ]

  const commitments = [
    'WCAG 2.1 Level AA compliance',
    'Regular accessibility audits',
    'Keyboard-only navigation support',
    'Screen reader compatibility',
    'High contrast mode support',
    'Clear and consistent navigation',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Eye size={64} className="text-premium-gold mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-ocean-darkGray mb-4">
            Accessibility Statement
          </h1>
          <p className="text-ocean-gray text-lg">
            We're committed to making Luxury Shop accessible to everyone.
          </p>
        </div>

        <div className="bg-white border border-ocean-border rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">Our Commitment</h2>
            <p className="text-ocean-gray leading-relaxed">
              Luxury Shop is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant 
              accessibility standards to achieve these goals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-6">Accessibility Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-3 bg-premium-gold/10 rounded-lg">
                      <Icon size={24} className="text-premium-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ocean-darkGray mb-2">{feature.title}</h3>
                      <p className="text-ocean-gray text-sm">{feature.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">Our Standards</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
              Our commitments include:
            </p>
            <ul className="space-y-3">
              {commitments.map((commitment, i) => (
                <li key={i} className="flex items-center gap-3 text-ocean-gray">
                  <CheckCircle size={20} className="text-premium-gold flex-shrink-0" />
                  <span>{commitment}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">Feedback</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">
              We welcome your feedback on the accessibility of Luxury Shop. If you encounter 
              any accessibility barriers, please contact us:
            </p>
            <div className="bg-ocean-lightest rounded-lg p-4">
              <p className="text-ocean-darkGray font-semibold">Accessibility Team</p>
              <p className="text-ocean-gray">Email: accessibility@luxuryshop.com</p>
              <p className="text-ocean-gray">Phone: +1 (555) 123-4567</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

