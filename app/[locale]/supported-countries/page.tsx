'use client';

import { useTranslations } from 'next-intl';
import Navigation from '@/components/Navigation';

const countries = [
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
];

export default function SupportedCountriesPage() {
  const t = useTranslations('supportedCountries');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('title')}</h1>
            <p className="text-xl text-gray-600 mb-2">{t('subtitle')}</p>
            <p className="text-lg text-gray-700">{t('description')}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {countries.map((country) => (
                <div
                  key={country.code}
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition cursor-pointer border-2 border-transparent hover:border-blue-200"
                >
                  <div className="text-5xl mb-3">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {country.name}
                  </h3>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Need assistance? Contact us to learn more about services available in your country.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

