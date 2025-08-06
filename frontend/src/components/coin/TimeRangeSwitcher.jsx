import React from 'react';

const timeRanges = [
  { label: '1D', value: 1 },
  { label: '1W', value: 7 },
  { label: '1M', value: 30 },
  { label: '1Y', value: 365 },
];

const TimeRangeSwitcher = ({ selectedRange, onRangeChange }) => {
  return (
    <div className="flex items-center justify-end gap-2 mb-4">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            selectedRange === range.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSwitcher;
