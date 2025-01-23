'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PriceRangeFilter = ({ min, max, step, onChange }) => {
  const { t } = useTranslation();
  const [range, setRange] = useState([min, max]);

  // Static histogram data with a bell curve distribution
  const histogramData = [
    12, 18, 25, 35, 48, 60, 75, 85, 92, 96, 98, 100,
    98, 95, 90, 84, 77, 69, 60, 52, 45, 38, 32, 27,
    23, 20, 17, 15, 13, 12, 11, 10, 10, 11, 12, 13,
    15, 17, 20, 23
  ];

  const handleRangeChange = (index) => (e) => {
    const newValue = parseInt(e.target.value);
    const newRange = [...range];
    newRange[index] = newValue;

    if (index === 0) {
      newRange[0] = Math.min(newRange[0], newRange[1] - step);
    } else {
      newRange[1] = Math.max(newRange[1], newRange[0] + step);
    }

    setRange(newRange);
    onChange(newRange);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{t('search.filters.price')}</h3>
        <p className="text-sm text-gray-500 mt-1">{t('search.priceBeforeTaxes')}</p>
      </div>

      {/* Histogram */}
      <div className="relative h-32 px-2">
        <div className="absolute inset-x-2 h-24 flex items-end">
          {histogramData.map((height, index) => (
            <div
              key={index}
              className="flex-1"
              style={{
                height: `${height}%`,
                backgroundColor: range[0] <= (min + (max - min) * (index / histogramData.length)) &&
                               (min + (max - min) * ((index + 1) / histogramData.length)) <= range[1]
                  ? '#71308A'
                  : '#E5E7EB',
                transition: 'background-color 0.2s ease'
              }}
            />
          ))}
        </div>

        {/* Range Input Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-12">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={range[0]}
            onChange={handleRangeChange(0)}
            className="range-slider absolute w-full pointer-events-none appearance-none bg-transparent"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={range[1]}
            onChange={handleRangeChange(1)}
            className="range-slider absolute w-full pointer-events-none appearance-none bg-transparent"
          />
        </div>
      </div>

      {/* Price Labels */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">
            {t('search.minimum')}
          </label>
          <div className="mt-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <span className="text-gray-900 font-semibold whitespace-nowrap">
              {range[0].toLocaleString()} SAR
            </span>
          </div>
        </div>
        <div className="text-right">
          <label className="block text-sm font-medium text-gray-500">
            {t('search.maximum')}
          </label>
          <div className="mt-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <span className="text-gray-900 font-semibold whitespace-nowrap">
              {range[1].toLocaleString()} SAR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;