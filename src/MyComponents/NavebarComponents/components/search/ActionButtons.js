'use client';

import { useTranslation } from 'react-i18next';

const ActionButtons = ({ onClear, onApply }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t">
      <button
        onClick={onClear}
        className="text-gray-600 hover:text-gray-800 transition-colors"
      >
        {t('search.clearAll')}
      </button>
      <button
        onClick={onApply}
        className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors"
      >
        {t('search.showResults')}
      </button>
    </div>
  );
};

export default ActionButtons;