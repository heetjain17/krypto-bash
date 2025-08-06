import React from 'react';
import { Link } from '@tanstack/react-router';

const CoinTable = ({ coins }) => {
  const formatCurrency = (number) => {
    if (typeof number !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  };

  const formatMarketCap = (number) => {
    if (typeof number !== 'number') return 'N/A';
    if (number > 1_000_000_000_000) {
      return `${(number / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (number > 1_000_000_000) {
      return `${(number / 1_000_000_000).toFixed(2)}B`;
    }
    if (number > 1_000_000) {
      return `${(number / 1_000_000).toFixed(2)}M`;
    }
    return number.toLocaleString();
  };

  const renderChangePercent = (change) => {
    if (typeof change !== 'number') {
      return <span className="text-gray-500">—</span>;
    }
    const color = change >= 0 ? 'text-green-600' : 'text-red-600';
    return <span className={color}>{change.toFixed(2)}%</span>;
  };

  return (
    <div className="max-w-6xl w-full px-5">
      {/* Desktop and Tablet Table View */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                className="w-4/12 lg:w-5/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Coin
              </th>
              <th
                scope="col"
                className="w-2/12 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="w-2/12 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                24h %
              </th>
              <th
                scope="col"
                className="hidden lg:table-cell w-3/12 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Market Cap
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coins.map((coin) => (
              <tr
                key={coin.id}
                className="hover:bg-gray-100 transition-colors duration-150"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {coin.market_cap_rank}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Link
                    to={`/coin/${coin.id}`}
                    className="flex items-center group"
                  >
                    <img
                      className="h-6 w-6 rounded-full mr-3 flex-shrink-0"
                      src={coin.image}
                      alt={`${coin.name} logo`}
                    />
                    <div className="truncate">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                        {coin.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium tabular-nums">
                  {formatCurrency(coin.current_price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm tabular-nums">
                  {renderChangePercent(coin.price_change_percentage_24h)}
                </td>
                <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 tabular-nums">
                  ${formatMarketCap(coin.market_cap)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {coins.map((coin) => (
          <Link
            to={`/coin/${coin.id}`}
            key={coin.id}
            className="block p-4 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-3">
                  {coin.market_cap_rank}.
                </span>
                <img
                  className="h-8 w-8 rounded-full mr-3"
                  src={coin.image}
                  alt={`${coin.name} logo`}
                />
                <div>
                  <p className="font-bold text-gray-900">{coin.name}</p>
                  <p className="text-sm text-gray-500">
                    {coin.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium tabular-nums">
                  {formatCurrency(coin.current_price)}
                </p>
                <div className="tabular-nums">
                  {renderChangePercent(coin.price_change_percentage_24h)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoinTable;
