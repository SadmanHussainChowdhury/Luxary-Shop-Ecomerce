import Link from 'next/link'
import { Crown, Sparkles, Award, Users, Heart, Globe, Target, TrendingUp, Shield } from 'lucide-react'

export const metadata = {
  title: 'About Us - Luxury Shop',
  description: 'Learn about Luxury Shop and our commitment to premium quality.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown size={48} className="text-premium-gold fill-premium-gold" />
            <Sparkles size={32} className="text-premium-amber fill-premium-amber" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-ocean-darkGray mb-6">
            About Luxury Shop
          </h1>
          <p className="text-xl text-ocean-gray max-w-3xl mx-auto leading-relaxed">
            Your premier destination for luxury products. We curate the finest selection 
            of premium items to elevate your lifestyle.
          </p>
        </div>

        {/* Our Story */}
        <section id="story" className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-ocean-darkGray mb-6">Our Story</h2>
              <div className="space-y-4 text-ocean-gray leading-relaxed">
                <p>
                  Founded in 2020, Luxury Shop was born from a simple vision: to bring 
                  world-class luxury products to discerning customers worldwide. We believe 
                  that everyone deserves access to premium quality, whether it's cutting-edge 
                  electronics, timeless fashion, or exquisite home decor.
                </p>
                <p>
                  What started as a small boutique has grown into a trusted global platform, 
                  serving millions of satisfied customers. Our commitment to excellence, 
                  authenticity, and customer satisfaction has made us a leader in the luxury 
                  e-commerce space.
                </p>
                <p>
                  Today, we continue to innovate and expand our curated collection, always 
                  staying true to our core values of quality, integrity, and exceptional service.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-premium-gold to-premium-amber rounded-2xl p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold mb-2">1M+</div>
                  <div className="text-white/80">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">50K+</div>
                  <div className="text-white/80">Premium Products</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">150+</div>
                  <div className="text-white/80">Countries Served</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">4.9★</div>
                  <div className="text-white/80">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-ocean-darkGray mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Quality First', desc: 'We source only the finest products from trusted manufacturers worldwide.' },
              { icon: Heart, title: 'Customer Focus', desc: 'Your satisfaction is our top priority. We go above and beyond for you.' },
              { icon: Shield, title: 'Trust & Integrity', desc: 'Transparent pricing, authentic products, and honest business practices.' },
              { icon: Globe, title: 'Global Reach', desc: 'Serving customers worldwide with fast, reliable shipping and support.' },
            ].map((value, i) => (
              <div key={i} className="bg-white border border-ocean-border rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="p-3 bg-premium-gold/10 rounded-lg w-fit mb-4">
                  <value.icon size={24} className="text-premium-gold" />
                </div>
                <h3 className="text-xl font-bold text-ocean-darkGray mb-3">{value.title}</h3>
                <p className="text-ocean-gray text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-ocean-border rounded-xl p-8">
              <Target size={32} className="text-premium-gold mb-4" />
              <h3 className="text-2xl font-bold text-ocean-darkGray mb-4">Our Mission</h3>
              <p className="text-ocean-gray leading-relaxed">
                To democratize luxury by making premium products accessible to everyone, 
                while maintaining the highest standards of quality and customer service.
              </p>
            </div>
            <div className="bg-white border border-ocean-border rounded-xl p-8">
              <TrendingUp size={32} className="text-premium-gold mb-4" />
              <h3 className="text-2xl font-bold text-ocean-darkGray mb-4">Our Vision</h3>
              <p className="text-ocean-gray leading-relaxed">
                To become the world's most trusted luxury e-commerce platform, known for 
                exceptional products, outstanding service, and innovative shopping experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section id="sustainability" className="mb-16">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6 text-center">Sustainability Commitment</h2>
            <p className="text-white/90 text-lg text-center max-w-3xl mx-auto mb-8">
              We're committed to sustainable practices and environmental responsibility. 
              Our packaging is eco-friendly, and we partner with brands that share our 
              values of environmental stewardship.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-white/80">Eco-Friendly Packaging</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Carbon</div>
                <div className="text-white/80">Neutral Shipping</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Ethical</div>
                <div className="text-white/80">Supply Chain</div>
              </div>
            </div>
          </div>
        </section>

        {/* Press */}
        <section id="press" className="mb-16">
          <h2 className="text-4xl font-bold text-ocean-darkGray mb-8 text-center">Press & Media</h2>
          <div className="bg-white border border-ocean-border rounded-xl p-8">
            <p className="text-ocean-gray mb-6 text-center">
              For media inquiries, please contact:
            </p>
            <div className="text-center space-y-2">
              <p className="font-bold text-ocean-darkGray">Press Team</p>
              <p className="text-ocean-gray">press@luxuryshop.com</p>
              <p className="text-ocean-gray">+1 (555) 123-4567</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-premium-gold to-premium-amber rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Luxury Community</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Experience the difference of premium shopping. Browse our curated collection 
            and discover products that elevate your lifestyle.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-premium-gold px-8 py-4 rounded-lg font-bold hover:bg-white/90 transition shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}

