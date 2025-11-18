'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import Navigation from '@/components/Navigation';

export default function HomePage() {
  const t = useTranslations('common');
  const tHome = useTranslations('home');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold premium-shadow">
              Premium Tax Services
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            {tHome('title')}
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-6 text-slate-700">
            {tHome('subtitle')}
          </p>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            {tHome('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${locale}/contact`}
              className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl premium-shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">{t('getStarted')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href={`/${locale}/about`}
              className="px-10 py-4 glass text-slate-700 font-bold rounded-xl premium-shadow hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>

        {/* Premium Service Cards */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 animate-slide-up">
          <div className="group relative glass rounded-2xl p-8 premium-shadow-lg hover:scale-105 transition-all duration-300 border border-white/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 premium-shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">{tNav('incomeTaxRefund')}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Get your income tax refund processed quickly and efficiently.
              </p>
              <Link 
                href={`/${locale}/incometaxrefund`} 
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-indigo-600 transition-colors group"
              >
                {t('readMore')}
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative glass rounded-2xl p-8 premium-shadow-lg hover:scale-105 transition-all duration-300 border border-white/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 premium-shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">{tNav('houseRentTaxRefund')}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Claim your house rent tax refund with our expert assistance.
              </p>
              <Link 
                href={`/${locale}/houserenttaxrefund`} 
                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-pink-600 transition-colors group"
              >
                {t('readMore')}
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative glass rounded-2xl p-8 premium-shadow-lg hover:scale-105 transition-all duration-300 border border-white/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 premium-shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">{tNav('familyTaxRefund')}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Maximize your family tax refund benefits with our services.
              </p>
              <Link 
                href={`/${locale}/familytaxrefund`} 
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-blue-600 transition-colors group"
              >
                {t('readMore')}
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

