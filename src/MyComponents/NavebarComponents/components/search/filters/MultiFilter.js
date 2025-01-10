'use client';

const MultiFilter = ({ selected, options, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            onClick={() => {
              const newValues = isSelected
                ? selected.filter(v => v !== option.id)
                : [...selected, option.id];
              onChange(newValues);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isSelected
                ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default MultiFilter;