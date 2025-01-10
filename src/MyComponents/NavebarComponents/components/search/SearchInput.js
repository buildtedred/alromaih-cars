'use client';

import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchInput = ({ value, onChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="relative mb-8">
      <input
        id="searchInput"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('search.placeholder')}
        className="w-full px-12 py-4 text-right rounded-2xl bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-lg"
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
    </div>
  );
};

export default SearchInput;