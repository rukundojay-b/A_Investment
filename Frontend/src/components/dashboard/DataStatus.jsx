// src/components/dashboard/DataStatus.jsx
import React from 'react';
import { FaDatabase, FaExclamationCircle, FaSync } from 'react-icons/fa';

const DataStatus = ({ darkMode, dataSource, onRefresh, refreshing }) => (
  <div className={`p-4 rounded-xl mb-8 border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center">
        {dataSource === 'database' ? (
          <FaDatabase className="text-green-500 mr-3 text-xl" />
        ) : dataSource === 'localstorage' ? (
          <FaExclamationCircle className="text-yellow-500 mr-3 text-xl" />
        ) : (
          <FaExclamationCircle className="text-red-500 mr-3 text-xl" />
        )}
        <div>
          <div className="font-bold">
            {dataSource === 'database' ? 'Connected to Database' : 
             dataSource === 'localstorage' ? 'Using Local Data' : 'Connection Error'}
          </div>
          <div className="text-xs opacity-75">
            {dataSource === 'database' ? 'Real-time data from MongoDB' : 
             dataSource === 'localstorage' ? 'Using cached data from browser' : 'Unable to connect to server'}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {dataSource === 'localstorage' && (
          <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
            Offline Mode
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center text-sm ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaSync className={refreshing ? 'animate-spin mr-2' : 'mr-2'} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
    {dataSource !== 'database' && (
      <div className="mt-3 text-xs">
        <p>⚠️ Some features may be limited. Make sure:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>Backend server is running on http://localhost:5000</li>
          <li>MongoDB connection is established</li>
          <li>You have an active internet connection</li>
        </ul>
      </div>
    )}
  </div>
);

export default DataStatus;