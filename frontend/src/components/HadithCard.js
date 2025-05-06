import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HadithCard = ({ hadith }) => {
  const [expanded, setExpanded] = useState(false);

  // Score presentation
  const scorePercentage = Math.round(hadith.score * 100);
  
  // Get score color based on percentage
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-primary-100 text-primary-800';
    if (score >= 40) return 'bg-blue-100 text-blue-800';
    if (score >= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Render full text or preview based on expanded state
  const renderText = () => {
    if (expanded) {
      return (
        <div className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
          {hadith.text}
        </div>
      );
    } else {
      // Limit text preview length
      const maxTextLength = 300;
      const textPreview = hadith.text.length > maxTextLength
        ? `${hadith.text.substring(0, maxTextLength)}...`
        : hadith.text;
        
      return (
        <div className="text-gray-700 mb-4">
          {textPreview}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 mr-2 flex-shrink-0">
                {hadith.metadata.source?.charAt(0) || '?'}
              </span>
              {hadith.metadata.source} - {hadith.metadata.hadith_no}
            </h3>
            <p className="text-sm text-gray-600 mt-1 ml-10">
              Chapter: {hadith.metadata.chapter || 'N/A'} 
              {hadith.metadata.chapter_no && ` (${hadith.metadata.chapter_no})`}
            </p>
          </div>
          <div className={`${getScoreColor(scorePercentage)} text-xs font-medium px-2.5 py-1 rounded-full flex items-center`}>
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
            </svg>
            {scorePercentage}%
          </div>
        </div>
        
        {renderText()}
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button 
            onClick={toggleExpand}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center transition-colors duration-150"
          >
            {expanded ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                Show Full Hadith
              </>
            )}
          </button>
          
          <Link 
            to={`/hadith/${hadith.hadith_id}`}
            state={{ hadith: hadith }}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center transition-colors duration-150"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HadithCard; 