import { useAuth } from '@clerk/clerk-react';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';
import { getMarketsForIds } from '@/api/coinGeckoClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getSupabaseClient = async (getToken) => {
  const token = await getToken({ template: 'supabase' });
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  return supabase;
};

export const useBookmarkStatus = (coinId) => {
  const { getToken, userId } = useAuth();

  return useQuery({
    queryKey: ['bookmark', userId, coinId],
    queryFn: async () => {
      if (!userId || !coinId) return false;

      const supabase = await getSupabaseClient(getToken);

      const { data, error } = await supabase
        .from('bookmarks')
        .select('coin_id')
        .eq('user_id', userId)
        .eq('coin_id', coinId);

      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!userId && !!coinId,
  });
};

export const useBookmarkToggle = (coinId) => {
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['bookmark', userId, coinId];
  return useMutation({
    mutationFn: async (isBookmarked) => {
      if (!userId) throw new Error('User not logged in');

      const supabase = await getSupabaseClient(getToken);

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('coin_id', coinId);
        if (error) throw error;
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: userId, coin_id: coinId });
        if (error) throw error;
      }
    },
    onMutate: async (isBookmarked) => {
      await queryClient.cancelQueries({ queryKey });
      const previousStatus = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, !isBookmarked);
      return { previousStatus };
    },
    onError: (error) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(queryKey, context.previousStatus);
      }
      console.error('Error toggling bookmark:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useBookmarkedCoins = () => {
  const { getToken, userId, isLoaded } = useAuth();

  // 1. Fetch the list of bookmarked coin IDs from Supabase
  const {
    data: bookmarkedCoinIds,
    isLoading: isLoadingBookmarks,
    isSuccess: isSuccessBookmarks,
  } = useQuery({
    queryKey: ['bookmarkedCoins', userId],
    queryFn: async () => {
      if (!userId) return [];
      const supabase = await getSupabaseClient(getToken);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('coin_id')
        .eq('user_id', userId);
      if (error) throw error;
      return data.map((item) => item.coin_id);
    },
    enabled: isLoaded && !!userId,
  });

  // 2. Use `useQueries` to fetch market data for each bookmarked coin ID in parallel
  const bookmarkedCoinsQueries = useQueries({
    queries: (bookmarkedCoinIds ?? []).map((coinId) => ({
      queryKey: ['marketForIds', [coinId]],
      queryFn: () => getMarketsForIds([coinId]),
      enabled: !!coinId,
    })),
  });

  // The overall loading state is true if the initial ID fetch is loading,
  // or if any of the individual coin market fetches are still loading.
  const isLoading =
    isLoadingBookmarks ||
    bookmarkedCoinsQueries.some((query) => query.isLoading);

  // --- SOLUTION: Directly calculate the final data ---
  // This will only contain data when all dependent queries are successful.
  const data = bookmarkedCoinsQueries
    .filter((query) => query.isSuccess && query.data)
    .flatMap((query) => query.data);

  // Handle the case where the user is signed in but has no bookmarks
  if (
    isSuccessBookmarks &&
    (!bookmarkedCoinIds || bookmarkedCoinIds.length === 0)
  ) {
    return { data: [], isLoading: false };
  }

  return { data, isLoading };
};
