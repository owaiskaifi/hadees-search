import React from 'react';

const AnswerPanel = ({ answer, question }) => {
  if (!answer) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-primary-100">
      <div className="flex items-center mb-4">
        <div className="bg-primary-100 rounded-full p-2 mr-3">
          <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Answer</h2>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-primary-400 italic text-gray-600">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-primary-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span>"{question}"</span>
        </div>
      </div>
      
      <div className="text-gray-700 bg-white rounded-lg p-5 border border-gray-100 leading-relaxed">
        {answer.split('\n\n').map((paragraph, index) => (
          <p key={index} className={index > 0 ? 'mt-4' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AnswerPanel; 