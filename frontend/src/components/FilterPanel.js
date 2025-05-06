import React from 'react';

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleSourceChange = (e) => {
    onFilterChange({ ...filters, filter_source: e.target.value || null });
  };

  const handleLimitChange = (e) => {
    onFilterChange({ ...filters, limit: parseInt(e.target.value) || 10 });
  };

  const clearFilters = () => {
    onFilterChange({ limit: 100 });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-4 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
        Filters
      </h3>
      
      <div className="space-y-5">
        <div className="mb-4">
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            id="source"
            value={filters.filter_source || ''}
            onChange={handleSourceChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition duration-150"
          >
            <option value="">All Sources</option>
            <option value="Bukhari">Bukhari</option>
            <option value="Muslim">Muslim</option>
            
          </select>
        </div>
        
        <div className="mb-5">
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
            Results Limit
          </label>
          <select
            id="limit"
            value={filters.limit || 100}
            onChange={handleLimitChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition duration-150"
          >
            <option value="10">10 results</option>
            <option value="20">20 results</option>
            <option value="50">50 results</option>
            <option value="100">100 results</option>
            <option value="1000">Max results</option>
          </select>
        </div>
        
        <button
          onClick={clearFilters}
          className="w-full bg-primary-50 text-primary-700 px-4 py-2 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-150 font-medium flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel; 