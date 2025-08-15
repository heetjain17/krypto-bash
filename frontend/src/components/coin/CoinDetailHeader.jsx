import React from 'react';
import TimeRangeSwitcher from './TimeRangeSwitcher';
import CoinChart from './CoinChart';
import { useBookmarkStatus, useBookmarkToggle } from '@/hooks/useBookmarks';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';

const formatCurrency = (number) => {
  if (number === null || number === undefined) {
    return '$0.00';
  }

  if (Math.abs(number) >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(number);
};

const CoinDetailHeader = ({ coin, chartData, days, setDays }) => {
  const price = coin.market_data.current_price.usd;
  const priceChange = coin.market_data.price_change_percentage_24h;

  const { data: isBookmarked, isLoading } = useBookmarkStatus(coin.id);
  const { mutate: toggleBookmark } = useBookmarkToggle(coin.id);

  const handleBookmarkClick = () => {
    toggleBookmark(isBookmarked);
  };

  return (
    <div className="mb-12">
      {/* --- Section 1: Coin Info & Bookmark Button --- */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <img src={coin.image.large} alt={coin.name} className="h-10 w-10" />
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">{coin.name}</h1>
            <p className="text-base font-medium text-neutral-500">
              {coin.symbol.toUpperCase()}
            </p>
          </div>
        </div>

        {/* --- Responsive Bookmark Button --- */}
        <div className="w-full md:w-auto">
          <SignedIn>
            <button
              onClick={handleBookmarkClick}
              disabled={isLoading}
              className={`flex w-full cursor-pointer md:w-auto items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out  ${
                isBookmarked
                  ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                  : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
              }`}
            >
              {isBookmarked ? (
                <IconBookmarkFilled size={18} />
              ) : (
                <IconBookmark size={18} />
              )}
              <span className="hidden md:inline">
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </span>
            </button>
          </SignedIn>
          <SignedOut>
            <Link
              to="/sign-in"
              className="flex items-center justify-center gap-2 bg-neutral-200 cursor-pointer hover:bg-neutral-300 text-neutral-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <IconBookmark size={18} />
              <span className="hidden md:inline">Sign in to Bookmark</span>
            </Link>
          </SignedOut>
        </div>
      </div>

      {/* --- Section 2: Price & Time Switcher --- */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 gap-4">
        <div className="flex flex-col gap-1 order-2 md:order-1">
          <p className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
            {formatCurrency(price)}
          </p>
          <p
            className={`text-lg font-semibold ${
              priceChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {priceChange.toFixed(2)}% (24h)
          </p>
        </div>
        <div className="order-1 md:order-2 self-end md:self-auto">
          <TimeRangeSwitcher selectedRange={days} onRangeChange={setDays} />
        </div>
      </div>

      {/* --- Section 3: Chart --- */}
      <div>
        <CoinChart chartData={chartData} days={days} />
      </div>
    </div>
  );
};

export default CoinDetailHeader;
