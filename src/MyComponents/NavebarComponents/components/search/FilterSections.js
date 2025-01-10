'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FilterContent from './FilterContent';
import { searchSections } from './searchConfig';

const FilterSections = ({
  selectedFilters,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="space-y-6">
      {Object.entries(searchSections).map(([sectionKey, section]) => (
        <div key={sectionKey} className="border rounded-lg p-4">
          <button
            onClick={() => setActiveSection(activeSection === sectionKey ? null : sectionKey)}
            className="w-full flex items-center justify-between text-lg font-medium mb-4"
          >
            <span>{section.title}</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${
              activeSection === sectionKey ? 'rotate-180' : ''
            }`} />
          </button>
          
          {activeSection === sectionKey && (
            <FilterContent
              section={sectionKey}
              filters={section.filters}
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterSections;