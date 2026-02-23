// src/components/dashboard/ReferralCard.jsx
import React from 'react';
import { FaShareAlt, FaCopy, FaCheckCircle } from 'react-icons/fa';

const ReferralCard = ({ darkMode, user, showCopySuccess, handleCopyReferralLink, handleShare }) => (
  <div className={`rounded-2xl p-4 md:p-6 mb-8 border ${darkMode ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700/30' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'}`}>
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <div className="flex items-center mb-2 md:mb-0">
        <FaShareAlt className="text-purple-500 text-xl mr-3" />
        <h2 className="text-xl md:text-2xl font-bold">Refer & Earn</h2>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'} font-bold self-start md:self-auto`}>
        10% Commission
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
      {/* Referral Link */}
      <div>
        <h3 className="font-bold mb-2 text-sm">Your Referral Link</h3>
        <div className="flex flex-col sm:flex-row">
          <div className={`flex-1 p-3 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} truncate text-sm`}>
            {user?.referralLink || `http://localhost:3000/signup?ref=${user?.referralCode || 'your-code'}`}
          </div>
          <button
            onClick={handleCopyReferralLink}
            className={`px-4 py-3 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white flex items-center justify-center`}
          >
            <FaCopy className="mr-2" />
            <span>Copy</span>
          </button>
        </div>
        {showCopySuccess && (
          <div className="mt-2 text-green-500 text-sm flex items-center">
            <FaCheckCircle className="mr-1" />
            Link copied to clipboard!
          </div>
        )}
      </div>

      {/* Referral Code */}
      <div>
        <h3 className="font-bold mb-2 text-sm">Your Referral Code</h3>
        <div className="flex items-center">
          <div className={`text-2xl md:text-3xl font-bold p-3 md:p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mr-4`}>
            {user?.referralCode || 'APEXXXX'}
          </div>
          <button
            onClick={handleShare}
            className={`flex-1 py-3 rounded-lg ${darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} text-white font-bold flex items-center justify-center text-sm`}
          >
            <FaShareAlt className="mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>

    {/* Referral Benefits */}
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <h4 className="font-bold mb-3">How it works:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mr-3 flex-shrink-0`}>
            <span className="font-bold text-sm">1</span>
          </div>
          <div>
            <div className="font-medium text-sm">Share your link</div>
            <div className="text-xs opacity-75">Send to friends & family</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'} flex items-center justify-center mr-3 flex-shrink-0`}>
            <span className="font-bold text-sm">2</span>
          </div>
          <div>
            <div className="font-medium text-sm">They join & invest</div>
            <div className="text-xs opacity-75">Minimum 6600 FRW</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} flex items-center justify-center mr-3 flex-shrink-0`}>
            <span className="font-bold text-sm">3</span>
          </div>
          <div>
            <div className="font-medium text-sm">Earn 10% commission</div>
            <div className="text-xs opacity-75">From their First Investment</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReferralCard;