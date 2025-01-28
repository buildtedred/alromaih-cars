import React, { useState } from 'react';
import LanguageSwitcher from '../enarbutton';

const Header = () => {
  const [language, setLanguage] = useState('en');

  const changeLanguage = (lng) => {
    setLanguage(lng);
    const path = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${lng}/${path}`;
  };

  return (
    <header>
     <LanguageSwitcher/>
      {/* ...existing code... */}
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
      {/* ...existing code... */}
    </header>
  );
};

export default Header;
