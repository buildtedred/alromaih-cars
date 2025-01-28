// 'use client';

// import { useState } from 'react';
// import { Languages } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function LanguageToggle() {
//   const [lang, setLang] = useState('en');

//   const toggleLanguage = () => {
//     const newLang = lang === 'ar' ? 'en' : 'ar';
//     setLang(newLang);
//     document.documentElement.lang = newLang;
//     document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
//   };

//   const router = useRouter();

//   const switchLanguage = (locale) => {
//     router.push(`/${locale}`);
//   };

//   return (
//     <>
//     <button
//       onClick={toggleLanguage}
//       className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
//     >
//       <Languages className="h-4 w-4" />
//       <span className="text-sm font-medium">
//         {lang === 'ar' ? 'العربية' : 'English'}
//       </span>
//     </button>


//      <div>
//       <button onClick={() => switchLanguage('en')}>English</button>
//       <button onClick={() => switchLanguage('ar')}>Arabic</button>
//     </div> 
//     </>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm font-medium">
        {lang === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}


// 'use client'; // Make sure this is a client component to access hooks like useNavigation

// import { useState } from 'react';
// import { useNavigation } from 'next/navigation'; // Import useNavigation
// import { usePathname } from 'next/navigation'; // To get the current path
// import { useRouter } from 'next/navigation';

// const LanguageToggle = () => {
//     const router = useRouter();
//   const pathname = usePathname(); // Get the current path
//   const [lang, setLang] = useState('en'); // Default to 'en', can be set dynamically based on initial locale

//   const toggleLanguage = () => {
//     const newLang = lang === 'en' ? 'ar' : 'en'; // Toggle between 'en' and 'ar'
//     setLang(newLang);

//     // Update the URL with the selected language (switch the locale dynamically)
//     // Navigate to the same path but with the new locale
//     router.push(`/${newLang}${pathname.slice(3)}`);
//   };

//   return (
//     <button
//       onClick={toggleLanguage}
//       className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
//     >
//       {/* Icon can change depending on language */}
//       <span className="text-sm font-medium">
//         {lang === 'ar' ? 'العربية' : 'English'}
//       </span>
//     </button>
//   );
// };

// export default LanguageToggle;

