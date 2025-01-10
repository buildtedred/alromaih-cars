'use client';

import SelectFilter from './filters/SelectFilter';
import MultiFilter from './filters/MultiFilter';
import PriceRangeFilter from './filters/PriceRangeFilter';

const FilterContent = ({
  section,
  filters,
  selectedFilters,
  onFilterChange,
}) => {
  const renderFilter = (filterKey, filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <SelectFilter
            value={selectedFilters[section]?.[filterKey] || ''}
            options={filter.options}
            onChange={(value) => onFilterChange(section, filterKey, value)}
          />
        );
      
      case 'multi':
        return (
          <MultiFilter
            selected={selectedFilters[section]?.[filterKey] || []}
            options={filter.options}
            onChange={(value) => onFilterChange(section, filterKey, value)}
          />
        );

      case 'range':
        return (
          <PriceRangeFilter
            min={filter.min}
            max={filter.max}
            step={filter.step}
            onChange={(range) => onFilterChange(section, filterKey, range)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(filters).map(([filterKey, filter]) => (
        <div key={filterKey} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {filter.title}
          </label>
          {renderFilter(filterKey, filter)}
        </div>
      ))}
    </div>
  );
};

export default FilterContent;