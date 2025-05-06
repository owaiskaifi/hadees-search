import React, { useState, useEffect } from 'react';
import { useParams,  useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const HadithDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // If we have a hadith from navigation state, use it
    if (location.state && location.state.hadith) {
      setHadith(location.state.hadith);
      setLoading(false);
      return;
    }

    // Otherwise fetch it from the API
    const fetchHadith = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/search`, {
          params: { query: id, limit: 10 }
        });
        
        if (response.data && response.data.length > 0) {
          // Find the exact match by hadith_id
          const exactMatch = response.data.find(h => h.hadith_id === id);
          if (exactMatch) {
            setHadith(exactMatch);
          } else {
            // If no exact match, use the first result
            setHadith(response.data[0]);
          }
        } else {
          setError('Hadith not found');
        }
      } catch (err) {
        console.error('Error fetching hadith:', err);
        setError('Failed to load hadith. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHadith();
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (error || !hadith) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
          <p className="font-medium">{error || 'Hadith not found'}</p>
          <p className="mt-2">The hadith you're looking for could not be found.</p>
        </div>
        <button 
          onClick={handleGoBack}
          className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to search
        </button>
      </div>
    );
  }

  // Format score as percentage
  const scorePercentage = Math.round(hadith.score * 100);

  // Check if the current hadith has a reference to another hadith
  // const isReferenceHadith = hasReference(hadith.text);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={handleGoBack}
        className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to search
      </button>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border border-gray-100">
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-start mb-6">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-800 mr-3 flex-shrink-0 text-lg font-bold">
                  {hadith.metadata.source?.charAt(0) || '?'}
                </span>
                <h1 className="text-3xl font-bold text-gray-800">
                  {hadith.metadata.source}
                </h1>
              </div>
              <div className="mt-2 ml-12">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  Hadith No: {hadith.metadata.hadith_no}
                </span>
                {scorePercentage >= 70 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                    High Relevance
                  </span>
                )}
              </div>
              {hadith.metadata.chapter && (
                <p className="text-lg text-gray-600 mt-3 ml-12">
                  Chapter: {hadith.metadata.chapter}
                  {hadith.metadata.chapter_no && ` (${hadith.metadata.chapter_no})`}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 w-full md:w-auto">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-primary-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-bold text-gray-700">Match Score</span>
              </div>
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="10" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-primary-600" 
                      strokeWidth="10" 
                      strokeDasharray={`${scorePercentage * 2.51} 251`} 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">{scorePercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 my-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hadith Text</h2>
            
            {/* Display hadith text exactly as in the HadithCard component */}
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {hadith.text}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Metadata</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(hadith.metadata).map(([key, value]) => 
                  value ? (
                    <div key={key} className="flex">
                      <dt className="text-sm font-medium text-gray-500 mr-2 capitalize">{key.replace('_', ' ')}:</dt>
                      <dd className="text-sm font-medium text-gray-800">{value}</dd>
                    </div>
                  ) : null
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HadithDetailPage; 