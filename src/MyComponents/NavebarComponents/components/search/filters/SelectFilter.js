'use client';

import { useTranslation } from 'react-i18next';

const SelectFilter = ({ value, options, onChange }) => {
  const { t } = useTranslation();

  return (
    <select
      className="w-full p-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{t('search.selectPlaceholder')}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
};

export default SelectFilter;