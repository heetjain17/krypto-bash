import { createFileRoute } from '@tanstack/react-router';
import '../styles.css';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import { useCoinMarkets, useCoinSearch } from '@/hooks/useCoingecko';
import CoinTable from '@/components/homepage/CoinTable';
import { IconLoader2 } from '@tabler/icons-react';
import PaginationControls from '@/components/homepage/PaginationControls';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAllCoinsData } from '@/api/coinGeckoClient';
import SearchBar from '@/components/homepage/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const UI_PER_PAGE = 10;
const API_PER_PAGE = 100;
const PAGES_PER_FETCH = API_PER_PAGE / UI_PER_PAGE;

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1000);
  const queryClient = useQueryClient();
  const apiPage = Math.floor((page - 1) / PAGES_PER_FETCH) + 1;

  const { data: searchResults, isLoading: isSearching } =
    useCoinSearch(debouncedQuery);

  const {
    data: paginatedCoins,
    isLoading: isFetchingPaginated,
    isError,
    isFetching,
  } = useCoinMarkets(apiPage, API_PER_PAGE);

  useEffect(() => {
    const nextApiPage = apiPage + 1;
    queryClient.prefetchQuery({
      queryKey: ['coinMarkets', { page: nextApiPage, perPage: API_PER_PAGE }],
      queryFn: () => getAllCoinsData(nextApiPage, API_PER_PAGE),
    });
  }, [apiPage, queryClient]);

  const renderContent = () => {
    if (debouncedQuery) {
      if (isSearching) {
        return (
          <div className="flex justify-center items-center h-60">
            <IconLoader2 className="animate-spin h-12 w-12 text-neutral-500" />
          </div>
        );
      }
      if (searchResults && searchResults.length === 0) {
        return (
          <p className="text-center py-10">
            No results found for "{debouncedQuery}".
          </p>
        );
      }
      if (searchResults) {
        return <CoinTable coins={searchResults} />;
      }
      return null;
    }

    if (isFetchingPaginated && !paginatedCoins) {
      return (
        <div className="flex justify-center items-center h-screen">
          <IconLoader2 className="animate-spin h-16 w-16 text-neutral-500" />
        </div>
      );
    }
    if (isError) {
      return (
        <p className="text-center text-red-500 py-10">Error fetching data.</p>
      );
    }
    if (paginatedCoins) {
      const pageIndexInBatch = (page - 1) % PAGES_PER_FETCH;
      const startIndex = pageIndexInBatch * UI_PER_PAGE;
      const endIndex = startIndex + UI_PER_PAGE;
      const coinsForPage = paginatedCoins.slice(startIndex, endIndex);
      return <CoinTable coins={coinsForPage} />;
    }
    return null;
  };

  const hasNextPage = paginatedCoins?.length === API_PER_PAGE;

  return (
    <div className="flex flex-col gap-5 pt-10">
      <SearchBar value={query} onChange={setQuery} />
      <div className="flex justify-center">{renderContent()}</div>
      {!debouncedQuery && (
        <PaginationControls
          currentPage={page}
          setPage={setPage}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
}
