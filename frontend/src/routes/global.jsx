import StatCard from '@/components/global/StatCard';
import { useGlobalData, useMarketTrends } from '@/hooks/useCoingecko';
import {
  IconWorld,
  IconTrendingUp,
  IconActivity,
  IconArrowUpRight,
  IconArrowDownRight,
  IconBuildingBank,
  IconRocket,
  IconCoins,
  IconAlertTriangle,
  IconLoader2,
} from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/global')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, isError, error } = useGlobalData();
  const {
    data: trendsData,
    isLoading: trendsLoading,
    isError: trendsError,
  } = useMarketTrends();
  console.log(trendsData);

  if (isLoading || trendsLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50">
        <IconLoader2 className="h-10 w-10 animate-spin text-neutral-400" />
      </div>
    );

  if (isError || trendsError)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-50">
        <IconAlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-3 font-semibold text-lg">Failed to load data</p>
        <p className="text-neutral-500 text-sm">{error?.message}</p>
      </div>
    );

  const { data: globalData } = data;

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(n);

  const formatNumber = (n) =>
    new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n);

  const marketCapChange = globalData.market_cap_change_percentage_24h_usd;
  const isPositive = marketCapChange >= 0;

  console.log(trendsData);

  const marketCapChartData = Object.entries(
    trendsData.data.total_market_cap
  ).map(([currency, value]) => ({
    currency: currency.toUpperCase(),
    value: value,
  }));

  const volumeChartData = Object.entries(trendsData.data.total_market_cap).map(
    ([currency, value]) => ({
      currency: currency.toUpperCase(),
      value: value,
    })
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          🌐 Global Crypto Market Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(160px,auto)]">
          {/* Market Cap */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <StatCard
              icon={<IconWorld className="w-5 h-5" />}
              title="Total Market Cap"
              value={formatCurrency(globalData.total_market_cap.usd)}
              footer={
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    isPositive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isPositive ? (
                    <IconArrowUpRight size={14} />
                  ) : (
                    <IconArrowDownRight size={14} />
                  )}
                  {marketCapChange.toFixed(2)}% (24h)
                </span>
              }
              chartData={marketCapChartData}
            />
          </div>

          {/* 24h Volume */}
          <StatCard
            icon={<IconActivity className="w-5 h-5" />}
            title="24h Trading Volume"
            value={formatCurrency(globalData.total_volume.usd)}
            chartData={volumeChartData}
          />

          {/* Active Coins */}
          <StatCard
            icon={<IconCoins className="w-5 h-5" />}
            title="Active Coins"
            value={formatNumber(globalData.active_cryptocurrencies)}
          />

          {/* BTC & ETH Dominance */}
          <StatCard
            icon={<IconTrendingUp className="w-5 h-5" />}
            title="BTC & ETH Dominance"
            value={`${globalData.market_cap_percentage.btc.toFixed(
              1
            )}% / ${globalData.market_cap_percentage.eth.toFixed(1)}%`}
          />

          {/* Tracked Exchanges */}
          <StatCard
            icon={<IconBuildingBank className="w-5 h-5" />}
            title="Tracked Exchanges"
            value={formatNumber(globalData.markets)}
          />

          {/* Ongoing ICOs */}
          <StatCard
            icon={<IconRocket className="w-5 h-5" />}
            title="Ongoing ICOs"
            value={formatNumber(globalData.ongoing_icos)}
          />
        </div>
      </div>
    </div>
  );
}
