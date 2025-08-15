import React from 'react';

const PaginationControls = ({
  currentPage,
  setPage,
  isFetching,
  hasNextPage,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    setPage(currentPage + 1);
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-6 mb-4 w-full px-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isFetching}
        className="px-2 py-1 cursor-pointer bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
      >
        Previous
      </button>

      <span className="text-base font-medium">{currentPage}</span>

      <button
        onClick={handleNext}
        disabled={isFetching || !hasNextPage}
        className="px-2 py-1 cursor-pointer bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        {isFetching ? 'Loading...' : 'Next'}
      </button>
    </div>
  );
};

export default PaginationControls;
