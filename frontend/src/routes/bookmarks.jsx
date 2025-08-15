import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useBookmarkedCoins } from '@/hooks/useBookmarks';
import CoinTable from '@/components/homepage/CoinTable';
import { IconLoader2 } from '@tabler/icons-react';
import { useAuth } from '@clerk/clerk-react';
import PaginationControls from '@/components/homepage/PaginationControls';

export const Route = createFileRoute('/bookmarks')({
  component: BookmarksPage,
});

const UI_PER_PAGE = 10; // Set how many coins to show per page

function BookmarksPage() {
  const { isSignedIn } = useAuth();
  const [page, setPage] = useState(1);
  const { data: bookmarkedCoins, isLoading } = useBookmarkedCoins();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <IconLoader2 className="animate-spin h-12 w-12 text-neutral-500" />
      </div>
    );
  }

  // Handle case where user is not signed in
  if (!isSignedIn) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-2">Please Sign In</h2>
        <p className="text-neutral-500">
          Sign in to view your bookmarked coins.
        </p>
      </div>
    );
  }

  // Handle case where user is signed in but has no bookmarks
  if (!bookmarkedCoins || bookmarkedCoins.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-2">No Bookmarks Found</h2>
        <p className="text-neutral-500">
          You haven't bookmarked any coins yet.
        </p>
      </div>
    );
  }

  // --- PAGINATION LOGIC ---
  const startIndex = (page - 1) * UI_PER_PAGE;
  const endIndex = startIndex + UI_PER_PAGE;
  const coinsForPage = bookmarkedCoins.slice(startIndex, endIndex);
  const hasNextPage = endIndex < bookmarkedCoins.length;

  // --- NEW: Add custom serial numbers ---
  // This overrides the market_cap_rank with a sequential number for this page only.
  const coinsWithSerial = coinsForPage.map((coin, index) => ({
    ...coin,
    market_cap_rank: startIndex + index + 1,
  }));
  // --- END NEW LOGIC ---

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6 px-5">Your Bookmarks</h1>
      {/* Pass the data with corrected serial numbers to the table */}
      <CoinTable coins={coinsWithSerial} />
      {/* Render pagination controls if there's more than one page */}
      {bookmarkedCoins.length > UI_PER_PAGE && (
        <PaginationControls
          currentPage={page}
          setPage={setPage}
          isFetching={isLoading}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
}
