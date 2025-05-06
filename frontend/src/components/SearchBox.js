import React, { useState } from 'react';

const SearchBox = ({ onSearch, placeholder = "Search hadith or ask a question..." }) => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('search'); // 'search' or 'question'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchMode);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-5 flex justify-center">
        <div className="inline-flex rounded-lg shadow-sm">
          <button
            type="button"
            className={`px-5 py-3 rounded-l-lg font-medium transition-all duration-200 ${
              searchMode === 'search'
                ? 'bg-primary-600 text-white shadow-inner'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSearchMode('search')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </div>
          </button>
          <button
            type="button"
            className={`px-5 py-3 rounded-r-lg font-medium transition-all duration-200 ${
              searchMode === 'question'
                ? 'bg-primary-600 text-white shadow-inner'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSearchMode('question')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ask
            </div>
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex w-full relative shadow-lg rounded-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchMode === 'search' ? "Search hadith..." : "Ask a question about hadith..."}
          className="w-full px-6 py-4 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
          autoFocus
        />
        <button
          type="submit"
          className="bg-primary-600 text-white px-8 py-4 rounded-r-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200 font-medium flex items-center"
        >
          {searchMode === 'search' ? (
            <>
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ask
            </>
          )}
        </button>
      </form>
      
      <div className="mt-3 text-center">
        <p className="text-sm text-white opacity-80">
          {searchMode === 'search' 
            ? "Search for terms like 'prayer', 'charity', 'fasting', etc." 
            : "Ask questions like 'What does Islam say about kindness?'"
          }
        </p>
      </div>
    </div>
  );
};

export default SearchBox; 