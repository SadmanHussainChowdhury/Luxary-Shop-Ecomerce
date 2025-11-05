import Link from 'next/link'
import { Briefcase, Users, TrendingUp, Award, Heart } from 'lucide-react'

export const metadata = {
  title: 'Careers - Luxury Shop',
  description: 'Join the Luxury Shop team and build your career with us.',
}

export default function CareersPage() {
  const benefits = [
    { icon: Users, title: 'Great Team', desc: 'Work with passionate professionals' },
    { icon: TrendingUp, title: 'Growth', desc: 'Career development opportunities' },
    { icon: Award, title: 'Benefits', desc: 'Competitive salary and benefits' },
    { icon: Heart, title: 'Culture', desc: 'Inclusive and supportive workplace' },
  ]

  const positions = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
    },
    {
      title: 'Customer Success Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco, CA',
      type: 'Full-time',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Briefcase size={64} className="text-premium-gold mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-ocean-darkGray mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-ocean-gray max-w-3xl mx-auto">
            Build your career with Luxury Shop. We're looking for talented individuals 
            who share our passion for excellence.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <div
                key={i}
                className="bg-white border border-ocean-border rounded-xl p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="p-3 bg-premium-gold/10 rounded-lg w-fit mx-auto mb-4">
                  <Icon size={24} className="text-premium-gold" />
                </div>
                <h3 className="text-lg font-bold text-ocean-darkGray mb-2">{benefit.title}</h3>
                <p className="text-ocean-gray text-sm">{benefit.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-ocean-darkGray mb-8 text-center">Open Positions</h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {positions.map((position, i) => (
              <div
                key={i}
                className="bg-white border border-ocean-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-ocean-darkGray mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-ocean-gray">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-premium-gold to-premium-amber text-white rounded-lg font-bold hover:shadow-lg transition">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-premium-gold to-premium-amber rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See a Position?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and we'll 
            keep you in mind for future opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-premium-gold px-8 py-4 rounded-lg font-bold hover:bg-white/90 transition shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

