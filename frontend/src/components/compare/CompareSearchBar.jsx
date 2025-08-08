import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@tanstack/react-router';
import React, { useEffect, useRef, useState } from 'react';
import SearchBar from '../homepage/SearchBar';
import { IconLoader2 } from '@tabler/icons-react';
import { useCoinSearch } from '@/hooks/useCoingecko';

const CompareSearchBar = ({ onCoinSelect }) => {
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { data: searchResults, isLoading: isSearching } =
    useCoinSearch(debouncedQuery);

  const handleSelect = (coin) => {
    onCoinSelect(coin);
    setQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <SearchBar value={query} onChange={setQuery} />

      {debouncedQuery && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {isSearching && (
            <div className="p-4 flex justify-center items-center">
              <IconLoader2 className="animate-spin h-6 w-6 text-neutral-600" />
            </div>
          )}
          {!isSearching && searchResults && (
            <ul className="max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((coin) => (
                  <li
                    key={coin.id}
                    onClick={() => handleSelect(coin)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{coin.name}</p>
                      <p className="text-sm text-neutral-500">{coin.symbol}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-neutral-500">
                  No results found
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CompareSearchBar;
