'use client';

import { useEffect } from 'react';
const DEFAULT_LOCALE = 'en';

export default function LocaleHtml() {
  const locale = DEFAULT_LOCALE;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}

