'use client';

import { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as motion from "motion/react-client"

export default function LanguageToggle() {
  const router = useRouter();
  const [lang, setLang] = useState('en');

  // Initialize the language from the document's current language
  useEffect(() => {
    const currentLang = document.documentElement.lang || 'en';
    setLang(currentLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);

    // Update HTML attributes for language and direction
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';

    // Get the current route (e.g., /about-us)
    const currentRoute = window.location.pathname;

    // Remove the current locale from the route (if present)
    const routeWithoutLocale = currentRoute.replace(/^\/(en|ar)/, '');

    // Redirect to the new locale with the current route
    router.push(`/${newLang}${routeWithoutLocale}`);
  };

  return (
    <motion.div
      animate={lang === "ar" ? { rotate: 0 } : { rotate: 360 }}
      transition={{ duration: 1 }}
    >
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border-brand-primary text-brand-primary transition-colors"
      >
        {lang === "ar" ?
          <img src="/arbic.svg" width={25} height={25} alt="Arbic svg" /> :
          <img src="/english.svg" width={25} height={25} alt="English svg" />
        }
      </button>
    </motion.div>
  );
}
