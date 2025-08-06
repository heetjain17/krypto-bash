import React from 'react';

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-neutral-500">{label}</p>
    <p className="text-xl font-semibold text-neutral-700">{value}</p>
  </div>
);

const CoinInfo = ({ coin }) => {
  const marketData = coin.market_data;

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-neutral-800">Market Data</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InfoItem
          label="Current Price"
          value={formatCurrency(marketData.current_price.usd)}
        />
        <InfoItem
          label="Market Cap"
          value={formatCurrency(marketData.market_cap.usd)}
        />
        <InfoItem
          label="Market Cap Rank"
          value={`#${marketData.market_cap_rank}`}
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
          label="Total Volume"
          value={formatCurrency(marketData.total_volume.usd)}
        />
        <InfoItem
          label="All-Time High"
          value={formatCurrency(marketData.ath.usd)}
        />
        <InfoItem
          label="Circulating Supply"
          value={marketData.circulating_supply.toLocaleString()}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-neutral-800">
          About {coin.name}
        </h2>
        <div
          className="prose max-w-none text-neutral-500"
          dangerouslySetInnerHTML={{ __html: coin.description.en }}
        />
      </div>
    </div>
  );
};

export default CoinInfo;
