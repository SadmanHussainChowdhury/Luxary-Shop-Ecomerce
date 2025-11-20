'use client';

import Link from 'next/link';
// Locale support removed
const DEFAULT_LOCALE = 'en';
import { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface Logo {
  imageUrl: string;
  altText?: string;
}

export default function Navigation() {
  // Translations removed
  const locale = DEFAULT_LOCALE;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logo, setLogo] = useState<Logo | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    fetchLogo();
  }, [locale]);

  const fetchLogo = async () => {
    try {
      setLogoLoading(true);
      const response = await fetch('/api/logo');
      if (response.ok) {
        const data = await response.json();
        setLogo(data.data);
      } else {
        // Fallback to text logo if no logo in database
        setLogo(null);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      setLogo(null);
    } finally {
      setLogoLoading(false);
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20 premium-shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            {logoLoading ? (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg animate-pulse"></div>
            ) : logo && logo.imageUrl ? (
              <img
                src={logo.imageUrl}
                alt={logo.altText || 'Logo'}
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">MultiLang Site</span>';
                  }
                }}
              />
            ) : (
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MultiLang Site
              </span>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-700 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105">
                About Us
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 glass rounded-xl premium-shadow-lg border border-white/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="py-2">
                  <Link href="/about" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2">
                    About
                  </Link>
                  <Link href="/ceo-message" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2">
                    CEO Message
                  </Link>
                  <Link href="/contact" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-700 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105">
                Tax Refund
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 glass rounded-xl premium-shadow-lg border border-white/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="py-2">
                  <Link href="/incometaxrefund" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2">
                    Income Tax Refund
                  </Link>
                  <Link href="/houserenttaxrefund" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2">
                    House Rent Tax Refund
                  </Link>
                  <Link href="/familytaxrefund" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2">
                    Family Tax Refund
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/visa-changes" className="text-slate-700 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105">
              Visa Changes
            </Link>
            <Link href="/job-support" className="text-slate-700 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105">
              Job Support
            </Link>
            <Link href="/supported-countries" className="text-slate-700 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105">
              Help & Support
            </Link>
            <Link href="/admin" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 premium-shadow hover:scale-105">
              Admin
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              <div>
                <p className="px-4 py-2 font-semibold text-gray-700">About Us</p>
                <Link href="/about" className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  About
                </Link>
                <Link href="/ceo-message" className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  CEO Message
                </Link>
                <Link href="/contact" className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  Contact Us
                </Link>
              </div>
              <div>
                <p className="px-4 py-2 font-semibold text-gray-700">Tax Refund</p>
                <Link href="/incometaxrefund" className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  Income Tax Refund
                </Link>
                <Link href="/houserenttaxrefund" className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  House Rent Tax Refund
                </Link>
                <Link href="/familytaxrefund" className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  Family Tax Refund
                </Link>
              </div>
              <Link href="/visa-changes" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Visa Changes
              </Link>
              <Link href="/job-support" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Job Support
              </Link>
              <Link href="/supported-countries" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Help & Support
              </Link>
              <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 font-semibold">
                Admin Panel
              </Link>
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

