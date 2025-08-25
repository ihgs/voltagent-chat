import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'tool';
}

interface Agent {
  id: string;
  name: string;
}

const Chat: React.FC = () => {
  const [conversationId, setConversationId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversationId(`conv-${Date.now()}`);
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setAgents(data.data);
          setSelectedAgentId(data.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };
    fetchAgents();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !selectedAgentId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/agents/${selectedAgentId}/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userMessage.text,
          options: {
            userId: 'user-123',
            conversationId,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success && data.data.provider && data.data.provider.response && data.data.provider.response.messages) {
        const botMessages: Message[] = data.data.provider.response.messages.map((msg: any) => {
          let textContent = '';
          if (Array.isArray(msg.content)) {
            msg.content.forEach((contentItem: any) => {
              if (contentItem.type === 'text') {
                textContent += contentItem.text;
              } else if (contentItem.type === 'tool-call') {
                textContent += `Tool call: ${contentItem.toolName}(${JSON.stringify(contentItem.args)})`;
              } else if (contentItem.type === 'tool-result') {
                textContent += `Tool result: ${JSON.stringify(contentItem.result)}`;
              }
            });
          }
          // Filter out messages with no text content
          if (!textContent) {
            return null;
          }

          return {
            id: msg.id,
            text: textContent,
            sender: msg.role,
          };
        }).filter(Boolean) as Message[]; // remove nulls

        console.log('botMessages:', botMessages);
        setMessages((prevMessages) => [...prevMessages, ...botMessages]);
      } else if (data.success && data.data.text) {
        const botMessage: Message = {
            id: `bot-${Date.now()}`,
            text: data.data.text,
            sender: 'assistant',
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        const errorMessage: Message = {
            id: `error-${Date.now()}`,
            text: 'Sorry, something went wrong.',
            sender: 'assistant',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }

    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Sorry, something went wrong.',
        sender: 'assistant',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold">VoltAgent Chat</h2>
        <div className="flex items-center">
          <label htmlFor="agent-select" className="mr-2">
            Agent:
          </label>
          <select
            id="agent-select"
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="bg-blue-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white"
            disabled={agents.length === 0 || isLoading}
          >
            {agents.length === 0 ? (
              <option>Loading...</option>
            ) : (
              agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))
            )}
          </select>
        </div>
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
              {message.sender !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg shadow-md break-words ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : message.sender === 'assistant'
                    ? 'bg-white text-gray-800 rounded-bl-none'
                    : 'bg-gray-400 text-black rounded-bl-none'
                }`}
              >
                {message.text || <span className="animate-pulse">...</span>}
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-indigo-300 flex-shrink-0"></div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <footer className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-start">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
            placeholder={
              isLoading ? 'Waiting for response...' : 'Type your message...'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={2}
            disabled={isLoading || !selectedAgentId}
          />
          <button
            className="ml-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !selectedAgentId}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
