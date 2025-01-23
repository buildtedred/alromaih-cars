
// src/All-routes/All-routes.js
import { Home, Car, Tag, Building, Info, Phone, Users } from 'lucide-react';

const navigationRoutes = (t) => [
  { key: 'home', label: t('nav.home'), href: '/', icon: Home },
  { key: 'allCars', label: t('nav.allCars'), href: '/all-cars', icon: Car },
  { key: 'brands', label: t('nav.brands'), href: '/brands', icon: Users },
  { key: 'offers', label: t('nav.offers'), href: '/offers', icon: Tag },
  { key: 'companies', label: t('nav.companies'), href: '/companies', icon: Building },
  { key: 'about', label: t('nav.about'), href: '/about-us', icon: Info },
  { key: 'contact', label: t('nav.contact'), href: '/contact-us', icon: Phone },
];

export default navigationRoutes;

