import React from 'react';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';

const SearchBar = ({ value, onChange }) => {
  const placeholders = [
    'Search for Bitcoin...',
    'What about Ethereum?',
    'Find Solana...',
    'Search for Dogecoin...',
    'Look up any cryptocurrency...',
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('submitted');
  };
  return (
    <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={(e) => onChange(e.target.value)}
      onSubmit={onSubmit}
      value={value}
    />
  );
};

export default SearchBar;
