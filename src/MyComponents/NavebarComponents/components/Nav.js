'use client';

import navigationRoutes from '@/All-routes/All-routes';
import { useTranslations } from 'next-intl';
import {Link} from '@/i18n/routing';
import { usePathname, useRouter } from 'next/navigation';


const Nav = ({ isMobile }) => {
  const { locale } = useRouter();
  const t = useTranslations();
  

  const navItems = navigationRoutes(t)

  return (
    <nav className={`bg-white border-t ${isMobile ? 'block md:hidden' : 'hidden md:block'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:h-12">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 rtl:space-x-reverse">
          {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  href={item.href}
                  key={item.key}
                  className="flex items-center text-gray-700 hover:text-brand-primary font-medium transition-colors py-3 md:py-0 border-b md:border-b-0 border-gray-100 last:border-b-0"
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;