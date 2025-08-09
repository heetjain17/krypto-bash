import React from 'react';
import { IconScale, IconPlus } from '@tabler/icons-react';
import CompareSearchBar from './CompareSearchBar';

const quickComparisons = [
  {
    label: 'Bitcoin vs. Ethereum',
    coins: [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        image:
          'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
      },
    ],
  },
  {
    label: 'Solana vs. Cardano',
    coins: [
      {
        id: 'solana',
        name: 'Solana',
        image:
          'https://assets.coingecko.com/coins/images/4128/thumb/solana.png',
      },
      {
        id: 'cardano',
        name: 'Cardano',
        image:
          'https://assets.coingecko.com/coins/images/975/thumb/cardano.png',
      },
    ],
  },
  {
    label: 'Dogecoin vs. Tron',
    coins: [
      {
        id: 'dogecoin',
        name: 'Dogecoin',
        image: 'https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png',
      },
      {
        id: 'tron',
        name: 'Tron',
        image:
          'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193',
      },
    ],
  },
];

const CompareHeader = ({ onQuickCompare }) => {
  return (
    <div className="text-center py-4 px-6 w-full">
      <IconScale
        className="mx-auto h-16 w-16 text-blue-500"
        strokeWidth={1.5}
      />
      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        Compare Cryptocurrencies
      </h2>
      <p className="mt-2 text-md text-gray-500 max-w-md mx-auto">
        Use the search bar above to add up to 5 coins and see their performance
        and key stats side-by-side.
      </p>

      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Or start with a popular comparison
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {quickComparisons.map((comp) => (
            <button
              key={comp.label}
              onClick={() => onQuickCompare(comp.coins)}
              className="flex items-center cursor-pointer gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <IconPlus size={16} />
              {comp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareHeader;
