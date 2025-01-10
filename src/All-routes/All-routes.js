<<<<<<< HEAD
const navigationBar = {
    items: [
      { name: "Home", link: "/" },
      { name: "All Cars", link: "/all-cars" },
      { name: "Brands", link: "/brands" },
      { name: "Offers", link: "/offers" },
      { name: "Companies", link: "/companies" },
      { name: "Contact Us", link: "/contact-us" },
      { name: "About Us", link: "/about-us" },
      { name: "Support", link: "/support" },
      { name: "Terms and Conditions", link: "/terms-and-conditions" },
      { name: "Privacy Policy", link: "/privacy-policy" },
      { name: "Return Policy", link: "/return-policy" },
      { name: "Carriers Page", link: "/carriers-page" },
    ],
  };
  
  export default navigationBar;
  
=======

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

>>>>>>> ubaidbranch
