'use client';

import { useEffect } from 'react';
import '../i18n';
import { useTranslation } from 'react-i18next';

export function Providers({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial language and direction
    const lang = i18n.language;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return children;
}