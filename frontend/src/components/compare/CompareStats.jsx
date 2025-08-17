import React from 'react';
import { useCompareCoinDetails } from '@/hooks/useCoingecko'; // Adjust path
import { IconLoader2 } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

// A hook to get the window width, useful for responsiveness
const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};

// A helper to format large currency values compactly
const formatCompactCurrency = (number) => {
  if (typeof number !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(number);
};

// A helper for precise, non-compact currency
const formatCurrency = (number) => {
  if (typeof number !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(number);
};

// Define the rows for our table, now with specific formatters
const statMetrics = [
  { key: 'current_price.usd', label: 'Price', formatter: formatCurrency },
  {
    key: 'market_cap.usd',
    label: 'Market Cap',
    formatter: formatCompactCurrency,
  },
  { key: 'market_cap_rank', label: 'Rank', formatter: (val) => `#${val}` },
  {
    key: 'total_volume.usd',
    label: 'Volume (24h)',
    formatter: formatCompactCurrency,
  },
  { key: 'ath.usd', label: 'All-Time High', formatter: formatCurrency },
  {
    key: 'circulating_supply',
    label: 'Circulating Supply',
    formatter: (val) =>
      new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(val),
  },
];

const CompareStatsTable = ({ selectedCoins }) => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768; // Tailwind's 'md' breakpoint
  const detailQueries = useCompareCoinDetails(selectedCoins);

  const isLoading = detailQueries.some((query) => query.isLoading);
  const isError = detailQueries.some((query) => query.isError);

  // Helper function to safely get nested property values
  const getStat = (data, key) => {
    const keys = key.split('.');
    let value = data?.market_data;
    if (!value) return undefined;
    for (let k of keys) {
      if (value[k] === undefined || value[k] === null) return undefined;
      value = value[k];
    }
    return value;
  };

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

  // --- RENDER LOGIC ---

  // Mobile View: A list of cards, one for each coin
  if (isMobile) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold px-4">Key Statistics</h2>
        {detailQueries.map((query, index) => {
          const coin = selectedCoins[index];
          return (
            <div
              key={coin.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <Link
                to={`/coin/${coin.id}`}
                className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200"
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-6 w-6 rounded-full"
                />
                <h3 className="text-lg font-bold text-gray-800">{coin.name}</h3>
              </Link>
              <div className="divide-y divide-gray-100">
                {statMetrics.map((metric) => {
                  const rawValue = query.isSuccess
                    ? getStat(query.data, metric.key)
                    : undefined;
                  const displayValue =
                    rawValue !== undefined ? metric.formatter(rawValue) : '...';
                  return (
                    <div
                      key={metric.key}
                      className="flex justify-between items-center p-4"
                    >
                      <p className="text-sm text-gray-500">{metric.label}</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {displayValue}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop View: The original table layout
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <h2 className="text-xl font-bold p-6">Key Statistics</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              {selectedCoins.map((coin) => (
                <th
                  key={coin.id}
                  className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <Link
                    className="flex items-center gap-2 hover:opacity-75"
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
                <td className="sticky left-0 bg-white hover:bg-gray-50 py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap">
                  {metric.label}
                </td>
                {detailQueries.map((query, index) => {
                  const rawValue = query.isSuccess
                    ? getStat(query.data, metric.key)
                    : undefined;
                  const displayValue =
                    rawValue !== undefined ? metric.formatter(rawValue) : '...';
                  return (
                    <td
                      key={selectedCoins[index].id}
                      className="py-4 px-6 text-sm text-gray-900 font-semibold whitespace-nowrap"
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareStatsTable;
