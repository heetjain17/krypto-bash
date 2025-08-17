import React from 'react';

const InfoItem = ({ label, value, className }) => (
  <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
    <p className="text-sm text-neutral-500 truncate">{label}</p>
    <p className="text-xl font-semibold text-neutral-700 truncate">{value}</p>
  </div>
);

const CoinInfo = ({ coin }) => {
  const marketData = coin.market_data;

  // For precise, non-compacted currency values (e.g., price)
  const formatCurrency = (number) => {
    if (number === null || number === undefined) return '$0.00';
    // Use more precision for prices under $1
    if (Math.abs(number) < 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(number);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  };

  // NEW: For large, compacted currency values (e.g., market cap)
  const formatCompactCurrency = (number) => {
    if (number === null || number === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(number);
  };

  // NEW: For large, non-currency numbers (e.g., supply)
  const formatCompactNumber = (number) => {
    if (number === null || number === undefined) return '0';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-neutral-800">Market Data</h2>
      {/* IMPROVED: Responsive grid stacks on extra-small screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoItem
          label="Current Price"
          value={formatCurrency(marketData.current_price.usd)}
        />
        <InfoItem
          label="Market Cap"
          value={formatCompactCurrency(marketData.market_cap.usd)}
        />
        <InfoItem
          label="Market Cap Rank"
          value={`#${marketData.market_cap_rank}`}
        />
        <InfoItem
          label="Total Volume"
          value={formatCompactCurrency(marketData.total_volume.usd)}
        />
        <InfoItem
          label="24h High"
          value={formatCurrency(marketData.high_24h.usd)}
        />
        <InfoItem
          label="24h Low"
          value={formatCurrency(marketData.low_24h.usd)}
        />
        <InfoItem
          label="All-Time High"
          value={formatCurrency(marketData.ath.usd)}
        />
        <InfoItem
          label="Circulating Supply"
          value={formatCompactNumber(marketData.circulating_supply)}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-neutral-800">
          About {coin.name}
        </h2>
        <div
          className="prose max-w-none text-neutral-600"
          dangerouslySetInnerHTML={{ __html: coin.description.en }}
        />
      </div>
    </div>
  );
};

export default CoinInfo;
