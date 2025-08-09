import React from 'react';
import { useCompareCoinDetails } from '@/hooks/useCoingecko'; // Adjust path
import { IconLoader2 } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

// A helper to format currency
const formatCurrency = (number) => {
  if (typeof number !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(number);
};

// Define the rows for our table
const statMetrics = [
  {
    key: 'current_price.usd',
    label: 'Current Price',
    formatter: formatCurrency,
  },
  { key: 'market_cap.usd', label: 'Market Cap', formatter: formatCurrency },
  {
    key: 'market_cap_rank',
    label: 'Market Cap Rank',
    formatter: (val) => `#${val}`,
  },
  { key: 'total_volume.usd', label: 'Volume (24h)', formatter: formatCurrency },
  { key: 'ath.usd', label: 'All-Time High', formatter: formatCurrency },
  {
    key: 'circulating_supply',
    label: 'Circulating Supply',
    formatter: (val) => val.toLocaleString(),
  },
];

const CompareStatsTable = ({ selectedCoins }) => {
  const detailQueries = useCompareCoinDetails(selectedCoins);

  const isLoading = detailQueries.some((query) => query.isLoading);
  const isError = detailQueries.some((query) => query.isError);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <IconLoader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">Error loading comparison data.</p>
    );
  }

  // Helper function to safely get nested property values
  const getStat = (data, key) => {
    const keys = key.split('.');
    let value = data?.market_data;
    if (!value) return 'N/A';
    for (let k of keys) {
      if (value[k] === undefined) return 'N/A';
      value = value[k];
    }
    return value;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <h2 className="text-xl font-bold p-6">Key Statistics</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              {selectedCoins.map((coin) => (
                <th
                  key={coin.id}
                  className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <Link
                    className="flex text-neutral-700 items-center gap-2 underline underline-1 hover:text-neutral-500"
                    to={`/coin/${coin.id}`}
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-5 w-5 rounded-full"
                    />
                    {coin.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statMetrics.map((metric) => (
              <tr key={metric.key} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap">
                  {metric.label}
                </td>
                {detailQueries.map((query, index) => (
                  <td
                    key={selectedCoins[index].id}
                    className="py-4 px-6 text-sm text-gray-900 font-semibold whitespace-nowrap"
                  >
                    {query.isSuccess
                      ? metric.formatter(getStat(query.data, metric.key))
                      : '...'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareStatsTable;
