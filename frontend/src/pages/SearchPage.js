import React, { useState } from 'react';
import SearchBox from '../components/SearchBox';
import HadithCard from '../components/HadithCard';
import AnswerPanel from '../components/AnswerPanel';
import FilterPanel from '../components/FilterPanel';
import { searchHadiths, answerQuestion } from '../services/api';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [filters, setFilters] = useState({ limit: 100 });

  const handleSearch = async (query, mode) => {
    setCurrentQuery(query);
    setIsQuestion(mode === 'question');
    setError(null);
    setLoading(true);
    
    try {
      if (mode === 'search') {
        // Regular search
        setAnswer(null);
        const results = await searchHadiths(query, filters);
        // Sort results by score in descending order
        const sortedResults = [...results].sort((a, b) => b.score - a.score);
        setSearchResults(sortedResults);
      } else {
        // Question answering - always use 5 results regardless of filter settings
        const response = await answerQuestion(query, 5);
        setAnswer(response.answer);
        // Sort results by score in descending order
        const sortedResults = [...response.hadiths].sort((a, b) => b.score - a.score);
        setSearchResults(sortedResults);
      }
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // If we have a current query, re-run the search with new filters
    // but only for search mode, not question mode
    if (currentQuery && !isQuestion) {
      handleSearch(currentQuery, 'search');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 bg-gradient-to-r from-primary-700 to-primary-500 py-16 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-white mb-4">Hadees Search</h1>
        <p className="text-xl text-white mb-10 opacity-90">Search for hadith or ask questions about Islamic teachings</p>
        
        <div className="max-w-4xl mx-auto px-4">
          <SearchBox onSearch={handleSearch} />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 mx-4 rounded-md" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 px-4">
          {/* Left side - Filters (Only show in search mode, not question mode) */}
          {searchResults.length > 0 && !isQuestion && (
            <div className="md:w-1/4">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}
          
          {/* Right side - Results */}
          <div className={searchResults.length > 0 && !isQuestion ? "md:w-3/4" : "w-full"}>
            {/* Answer Panel (for question mode) */}
            {answer && <AnswerPanel answer={answer} question={currentQuery} />}
            
            {/* Search Results */}
            {searchResults.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  {searchResults.length} {isQuestion ? 'Related Hadiths' : 'Search Results'}
                </h2>
                <div className="space-y-6">
                  {searchResults.map((hadith) => (
                    <HadithCard key={hadith.hadith_id} hadith={hadith} />
                  ))}
                </div>
              </div>
            ) : currentQuery && !loading ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 text-lg">No hadiths found matching your query.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 