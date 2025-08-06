import React from 'react';
import TimeRangeSwitcher from './TimeRangeSwitcher';
import CoinChart from './CoinChart';

const formatCurrency = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(number);
};

const CoinDetailHeader = ({ coin, chartData, days, setDays }) => {
  const price = coin.market_data.current_price.usd;
  const priceChange = coin.market_data.price_change_percentage_24h;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <img src={coin.image.large} alt={coin.name} className="h-10 w-10" />
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">{coin.name}</h1>
            <p className="text-base font-medium text-neutral-500">
              {coin.symbol.toUpperCase()}
            </p>
          </div>
        </div>
        <button className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-2 px-4 rounded-lg transition-colors">
          Bookmark
        </button>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-4xl font-bold text-neutral-900 tracking-tight">
            {formatCurrency(price)}
          </p>
          <p
            className={`text-lg font-semibold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {priceChange.toFixed(2)}% (24h)
          </p>
        </div>
        <TimeRangeSwitcher selectedRange={days} onRangeChange={setDays} />
      </div>

      <div>
        <CoinChart chartData={chartData} days={days} />
      </div>
    </div>
  );
};

export default CoinDetailHeader;
