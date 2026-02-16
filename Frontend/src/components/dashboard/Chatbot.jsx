// src/components/dashboard/Chatbot.jsx
import React from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const Chatbot = ({ 
  darkMode, showChatbot, setShowChatbot, chatMessages, 
  chatMessage, setChatMessage, sendChatMessage, chatEndRef 
}) => {
  if (!showChatbot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => setShowChatbot(false)}
      />
      
      {/* Chatbot Modal */}
      <div className={`relative w-full max-w-md max-h-[80vh] sm:max-h-[600px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-4 rounded-t-2xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <FaRobot className="text-blue-500 mr-3 text-xl" />
            <div>
              <h3 className="font-bold">Apex Invest Assistant</h3>
              <p className="text-xs opacity-75">Online • 24/7 Support</p>
            </div>
          </div>
          <button
            onClick={() => setShowChatbot(false)}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-3 rounded-2xl max-w-[80%] ${msg.sender === 'user' 
                  ? darkMode ? 'bg-blue-600 rounded-br-none' : 'bg-blue-500 text-white rounded-br-none'
                  : darkMode ? 'bg-gray-700 rounded-bl-none' : 'bg-gray-200 rounded-bl-none'}`}
              >
                <div className="text-sm">{msg.message}</div>
                <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'opacity-60'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Type your message..."
              className={`flex-1 p-3 rounded-l-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} text-sm`}
            />
            <button
              onClick={sendChatMessage}
              className={`px-4 rounded-r-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="text-xs opacity-75 mt-2">
            Type "help" for commands • Responses may take a moment
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;