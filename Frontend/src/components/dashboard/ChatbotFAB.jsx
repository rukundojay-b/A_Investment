// src/components/dashboard/ChatbotFAB.jsx
import React from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

const ChatbotFAB = ({ darkMode, setShowChatbot }) => {
  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowChatbot(true)}
        className={`
          fixed bottom-6 right-6 z-40
          w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          transition-all duration-300
          transform hover:scale-110 active:scale-95
          ${darkMode 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }
          text-white
          md:hidden
        `}
        title="Chat Support"
        aria-label="Open chat support"
      >
        <FaRobot className="text-2xl" />
        
        {/* Pulse animation for attention */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
        </span>
      </button>

      {/* Optional: Quick tooltip that appears on first visit */}
      <div className="fixed bottom-24 right-6 z-40 md:hidden animate-bounce">
        <div className={`relative px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-3 h-3 bg-inherit"></div>
          Need help? 💬
        </div>
      </div>
    </>
  );
};

export default ChatbotFAB;