'use client';

import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchInput from './SearchInput';
import FilterSections from './FilterSections';
import SelectedFilters from './SelectedFilters';
import ActionButtons from './ActionButtons';
import SearchResults from './SearchResults';

const SearchModal = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  selectedFilters,
  onClearFilters,
  onFilterChange,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 top-0 bg-white shadow-lg transform transition-all duration-300 ease-out z-50 h-[90vh] md:h-auto md:max-h-[90vh] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t('search.title')}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Filters Section */}
              <div className="lg:col-span-4">
                <SearchInput
                  value={searchQuery}
                  onChange={onSearchChange}
                />

                <FilterSections
                  selectedFilters={selectedFilters}
                  onFilterChange={onFilterChange}
                />

                <SelectedFilters
                  selectedFilters={selectedFilters}
                  onFilterChange={onFilterChange}
                />

                <ActionButtons
                  onClear={onClearFilters}
                  onApply={onClose}
                />
              </div>

              {/* Results Section */}
              <div className="lg:col-span-8">
                <SearchResults
                  query={searchQuery}
                  filters={selectedFilters}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;