import CoinChart from '@/components/coin/CoinChart';
import CoinDetailHeader from '@/components/coin/CoinDetailHeader';
import CoinInfo from '@/components/coin/CoinInfo';
import { useCoinCharts, useCoinDetails } from '@/hooks/useCoingecko';
import { IconLoader2 } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/coin/$coinSlug')({
  component: RouteComponent,
});

function RouteComponent() {
  const { coinSlug } = Route.useParams();
  const [days, setDays] = useState(7);
  const {
    data: coin,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useCoinDetails(coinSlug);

  const {
    data: chartData,
    isLoading: isLoadingChart,
    isError: isErrorChart,
  } = useCoinCharts(coinSlug, days);

  if (isLoadingDetails || isLoadingChart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <IconLoader2 className="animate-spin h-12 w-12 text-neutral-500" />
      </div>
    );
  }

  if (isErrorDetails || isErrorChart) {
    return (
      <p className="text-center text-red-500 py-10">
        Error fetching coin data.
      </p>
    );
  }

  return (
    <div className=" p-4">
      <CoinDetailHeader
        coin={coin}
        chartData={chartData}
        days={days}
        setDays={setDays}
      />

      <CoinInfo coin={coin} />
    </div>
  );
}
