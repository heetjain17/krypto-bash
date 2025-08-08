import React, { useState } from 'react';
import { IconX } from '@tabler/icons-react';

const CoinPill = ({ coin, onRemove }) => {
  return (
    <div className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full animate-fade-in">
      <img
        className="h-5 w-5 mr-2 rounded-full"
        src={coin.image}
        alt={coin.name}
      />
      <span>{coin.name}</span>
      <button
        onClick={onRemove}
        className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer rounded-full hover:bg-blue-200 p-0.5 transition-colors"
        aria-label={`Remove ${coin.name}`}
      >
        <IconX size={16} />
      </button>
    </div>
  );
};

export default CoinPill;
