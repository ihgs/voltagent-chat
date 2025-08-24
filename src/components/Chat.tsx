import React, { useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
    { id: 2, text: 'I want to create a web chat screen.', sender: 'user' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), text: inputValue, sender: 'user' },
      ]);
      setInputValue('');
      // Here you would typically add logic to get a bot response
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-blue-600 text-white p-4 text-xl font-bold shadow-md">
        <h2>Gemini Chat</h2>
      </header>
      <div className="flex-grow p-6 overflow-auto">
        <div className="flex flex-col gap-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg shadow-md ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
               {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-indigo-300 flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <footer className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-start">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={2}
          />
          <button
            className="ml-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
