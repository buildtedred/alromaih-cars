'use client';

import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { searchSections } from './searchConfig';

const SelectedFilters = ({
  selectedFilters,
  onFilterChange,
}) => {
  const { t } = useTranslation();

  if (Object.keys(selectedFilters).length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{t('search.selectedFilters')}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(selectedFilters).map(([section, filters]) =>
          Object.entries(filters).map(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map((v) => {
                const option = searchSections[section]?.filters[key]?.options?.find(
                  (opt) => opt.id === v
                );
                return option && (
                  <span
                    key={`${section}-${key}-${v}`}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary"
                  >
                    {t(option.label)}
                    <button
                      onClick={() => {
                        const newValues = value.filter((val) => val !== v);
                        onFilterChange(section, key, newValues);
                      }}
                      className="hover:text-brand-dark"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                );
              });
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default SelectedFilters;