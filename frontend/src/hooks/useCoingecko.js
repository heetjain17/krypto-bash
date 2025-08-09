import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getAllCoinsData,
  getCoinData,
  getCoinChart,
  searchCoins,
  getMarketsForIds,
} from '../api/coinGeckoClient';

export const useCoinMarkets = (page = 1, perPage = 10, enabled = true) => {
  return useQuery({
    queryKey: ['coinMarkets', { page, perPage }],
    queryFn: () => getAllCoinsData(page, perPage),
    keepPreviousData: true,
    enabled: enabled,
  });
};

export const useCoinDetails = (coinId) => {
  return useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: () => getCoinData(coinId),
    enabled: !!coinId,
  });
};

export const useCoinCharts = (coinId, days = 365) => {
  return useQuery({
    queryKey: ['coinChart', coinId, { days }],
    queryFn: () => getCoinChart(coinId, days),
    enabled: !!coinId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCoinSearch = (query) => {
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchCoins(query),
    enabled: !!query,
  });

  const coinIds = searchResults?.map((coin) => coin.id) || [];

  const { data: coins, isLoading: isFetchingMarkets } = useQuery({
    queryKey: ['marketForIds', coinIds],
    queryFn: () => getMarketsForIds(coinIds),
    enabled: !!searchResults && coinIds.length > 0,
  });

  return {
    data: coins,
    isLoading: isSearching || isFetchingMarkets,
  };
};

export const useCompareCoinDetails = (coins) => {
  return useQueries({
    queries: coins.map((coin) => ({
      queryKey: ['coinDetails', coin.id],
      queryFn: () => getCoinData(coin.id),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!coin.id,
    })),
  });
};

export const useCompareCoinCharts = (coins, days) => {
  return useQueries({
    queries: coins.map((coin) => ({
      queryKey: ['coinChart', coin.id, { days }],
      queryFn: () => getCoinChart(coin.id, days),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!coin.id && !!days,
    })),
  });
};
