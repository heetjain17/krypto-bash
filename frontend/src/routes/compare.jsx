import { getCoinChart } from '@/api/coinGeckoClient';
import TimeRangeSwitcher from '@/components/coin/TimeRangeSwitcher';
import CoinPill from '@/components/compare/CoinPill';
import CompareChart from '@/components/compare/CompareChart';
import CompareHeader from '@/components/compare/CompareHeader';
import CompareSearchBar from '@/components/compare/compareSearchBar';
import CompareStatsTable from '@/components/compare/CompareStats';
import { useCompareCoinCharts } from '@/hooks/useCoingecko';
import { IconLoader2 } from '@tabler/icons-react';
import { useQueries } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/compare')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [days, setDays] = useState(7);
  const handleCoinSelection = (coin) => {
    if (
      selectedCoins.length < 5 &&
      !selectedCoins.some((c) => c.id === coin.id)
    ) {
      setSelectedCoins([...selectedCoins, coin]);
    }
  };

  const chartQueries = useCompareCoinCharts(selectedCoins, days);
  const isLoadingCharts = chartQueries.some((query) => query.isLoading);

  const chartDataSets = chartQueries
    .map((query, idx) => ({
      id: selectedCoins[idx].id,
      name: selectedCoins[idx].name,
      prices: query.data?.prices,
    }))
    .filter((d) => d.prices);
  const handleRemoveCoin = (coinId) => {
    setSelectedCoins(selectedCoins.filter((c) => c.id !== coinId));
  };

  const handleQuickCompare = (coins) => {
    setSelectedCoins(coins);
  };

  return (
    <div className="flex flex-col items-center mt-4 gap-8 w-full">
      {/* Conditionally render the search bar and pills */}
      {selectedCoins.length > 0 ? (
        <>
          <CompareSearchBar onCoinSelect={handleCoinSelection} />
          <div className="flex flex-wrap justify-center gap-3">
            {selectedCoins.map((coin) => (
              <CoinPill
                key={coin.id}
                coin={coin}
                onRemove={() => handleRemoveCoin(coin.id)}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="w-full mt-4">
        {selectedCoins.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CompareHeader onQuickCompare={handleQuickCompare} />
            <CompareSearchBar onCoinSelect={handleCoinSelection} />
          </div>
        ) : (
          <>
            {isLoadingCharts ? (
              <div className="flex justify-center items-center h-screen">
                <IconLoader2 className="animate-spin h-6 w-6 text-neutral-600" />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="w-full bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      Performance Comparison (% Change)
                    </h2>
                    <TimeRangeSwitcher
                      selectedRange={days}
                      onRangeChange={setDays}
                    />
                  </div>
                  <CompareChart chartDataSets={chartDataSets} days={days} />
                </div>
                <div className="w-full">
                  <CompareStatsTable selectedCoins={selectedCoins} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
