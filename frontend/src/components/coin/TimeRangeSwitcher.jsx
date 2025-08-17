import React from 'react';

const timeRanges = [
  { label: '1D', value: 1 },
  { label: '1W', value: 7 },
  { label: '1M', value: 30 },
  { label: '1Y', value: 365 },
];

const TimeRangeSwitcher = ({ selectedRange, onRangeChange }) => {
  return (
    // The parent component should now handle alignment (e.g., justify-end) and margin
    <div className="flex items-center gap-1 sm:gap-2">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`
            flex-1 sm:flex-none justify-center // Stretches on mobile, fits content on larger screens
            py-2 px-3 sm:px-4 // Larger touch target and responsive padding
            text-sm font-semibold 
            rounded-lg 
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-800 // Accessibility
            ${
              selectedRange === range.value
                ? 'bg-neutral-800 text-white' // Modern, high-contrast selected state
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSwitcher;
