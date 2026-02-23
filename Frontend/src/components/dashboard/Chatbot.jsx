// src/components/dashboard/Chatbot.jsx
import React, { useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSmile, FaImage } from 'react-icons/fa';

const Chatbot = ({ 
  darkMode, showChatbot, setShowChatbot, chatMessages, 
  chatMessage, setChatMessage, sendChatMessage, chatEndRef 
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showChatbot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showChatbot]);

  if (!showChatbot) return null;

  // Format time to be more readable
  const formatMessageTime = (time) => {
    if (time === 'Just now') return time;
    return time;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setShowChatbot(false)}
      />
      
      {/* Chatbot Modal - Mobile optimized */}
      <div className={`
        relative w-full h-[90vh] sm:h-auto sm:max-h-[600px] sm:w-96 
        rounded-t-2xl sm:rounded-2xl shadow-2xl 
        flex flex-col 
        ${darkMode ? 'bg-gray-800' : 'bg-white'}
        transform transition-transform duration-300 ease-out
        animate-slide-up
      `}>
        {/* Header - Sticky with better mobile touch target */}
        <div className={`
          sticky top-0 z-10
          p-4 rounded-t-2xl flex items-center justify-between 
          ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}
          border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}
        `}>
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mr-3
              ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}
            `}>
              <FaRobot className="text-white text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-base">Apex Assistant</h3>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                <p className="text-xs opacity-75">Online • 24/7 Support</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowChatbot(false)}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${darkMode ? 'hover:bg-gray-600 active:bg-gray-500' : 'hover:bg-gray-200 active:bg-gray-300'}
              transition-colors touch-manipulation
            `}
            aria-label="Close chat"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Messages - Scrollable area with better spacing */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for bot messages */}
              {msg.sender === 'bot' && (
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 self-end
                  ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
                `}>
                  <FaRobot className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
              )}
              
              {/* Message bubble */}
              <div
                className={`
                  relative max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl
                  ${msg.sender === 'user' 
                    ? darkMode 
                      ? 'bg-blue-600 rounded-br-none' 
                      : 'bg-blue-500 text-white rounded-br-none'
                    : darkMode 
                      ? 'bg-gray-700 rounded-bl-none' 
                      : 'bg-gray-100 rounded-bl-none'
                  }
                  shadow-sm
                `}
              >
                <div className="text-sm leading-relaxed break-words">
                  {msg.message}
                </div>
                <div className={`
                  text-[10px] mt-1.5 text-right
                  ${msg.sender === 'user' 
                    ? 'text-blue-200' 
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }
                `}>
                  {formatMessageTime(msg.time)}
                </div>
              </div>

              {/* Avatar for user messages */}
              {msg.sender === 'user' && (
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0 self-end
                  ${darkMode ? 'bg-blue-700' : 'bg-blue-100'}
                `}>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-blue-600'}`}>
                    U
                  </span>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area - Sticky with better mobile keyboard handling */}
        <div className={`
          sticky bottom-0 p-3 
          border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        `}>
          <div className="flex items-center space-x-2">
            {/* Attachment button (optional) */}
            <button
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
                transition-colors touch-manipulation
              `}
              aria-label="Attach file"
            >
              <FaImage className={darkMode ? 'text-gray-300' : 'text-gray-600'} size={18} />
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className={`
                  w-full p-3 pr-12 rounded-xl border
                  ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 placeholder-gray-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  text-base leading-relaxed
                `}
                style={{ minHeight: '44px' }} // Minimum touch target size
              />
              
              {/* Emoji button (optional) */}
              <button
                className={`
                  absolute right-3 top-1/2 transform -translate-y-1/2
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}
                  transition-colors touch-manipulation
                `}
                aria-label="Add emoji"
              >
                <FaSmile className={darkMode ? 'text-gray-300' : 'text-gray-500'} size={18} />
              </button>
            </div>

            {/* Send button */}
            <button
              onClick={sendChatMessage}
              disabled={!chatMessage.trim()}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                ${darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800' 
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                }
                text-white disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors touch-manipulation
                shadow-md
              `}
              aria-label="Send message"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>

          {/* Quick reply suggestions (optional) */}
          <div className="flex mt-3 space-x-2 overflow-x-auto pb-1 hide-scrollbar">
            {['Help', 'Investments', 'Withdraw', 'Deposit'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setChatMessage(suggestion);
                  setTimeout(() => sendChatMessage(), 100);
                }}
                className={`
                  px-4 py-2 rounded-full text-sm whitespace-nowrap
                  ${darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                  transition-colors touch-manipulation
                `}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Typing indicator */}
          <div className="text-xs opacity-60 mt-2 text-center">
            <span className="inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce mr-1"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce mr-1" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="ml-2">Assistant is typing...</span>
            </span>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;