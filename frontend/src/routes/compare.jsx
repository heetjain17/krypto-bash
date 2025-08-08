import CoinPill from '@/components/compare/CoinPill';
import CompareSearchBar from '@/components/compare/compareSearchBar';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/compare')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedCoins, setSelectedCoins] = useState([]);
  const handleCoinSelection = (coin) => {
    if (
      selectedCoins.length < 5 &&
      !selectedCoins.some((c) => c.id === coin.id)
    ) {
      setSelectedCoins([...selectedCoins, coin]);
    }
  };

  const handleRemoveCoin = (coinId) => {
    setSelectedCoins(selectedCoins.filter((c) => c.id !== coinId));
  };

  return (
    <div className="flex flex-col items-center mt-4 ">
      <CompareSearchBar onCoinSelect={handleCoinSelection} />

      {selectedCoins.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {selectedCoins.map((coin) => (
            <CoinPill
              key={coin.id}
              coin={coin}
              onRemove={() => handleRemoveCoin(coin.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
