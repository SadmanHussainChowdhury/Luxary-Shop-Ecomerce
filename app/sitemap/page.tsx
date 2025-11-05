import Link from 'next/link'
import { Map, Home, ShoppingBag, User, HelpCircle, FileText } from 'lucide-react'

export const metadata = {
  title: 'Sitemap - Luxury Shop',
  description: 'Site map for Luxury Shop.',
}

export default function SitemapPage() {
  const sections = [
    {
      icon: Home,
      title: 'Main Pages',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Premium Products', href: '/products/premium' },
        { name: 'Cart', href: '/cart' },
      ],
    },
    {
      icon: User,
      title: 'Account',
      links: [
        { name: 'My Account', href: '/account' },
        { name: 'Wishlist', href: '/account/wishlist' },
        { name: 'Login', href: '/login' },
        { name: 'Register', href: '/register' },
      ],
    },
    {
      icon: HelpCircle,
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Track Order', href: '/account' },
        { name: 'Shipping Info', href: '/help#shipping' },
      ],
    },
    {
      icon: FileText,
      title: 'Legal',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Careers', href: '/careers' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Map size={64} className="text-premium-gold mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-ocean-darkGray mb-4">
            Sitemap
          </h1>
          <p className="text-ocean-gray text-lg">
            Find all pages on our website
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {sections.map((section, i) => {
            const Icon = section.icon
            return (
              <div key={i} className="bg-white border border-ocean-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-premium-gold/10 rounded-lg">
                    <Icon size={20} className="text-premium-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-ocean-darkGray">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-ocean-gray hover:text-premium-gold transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

