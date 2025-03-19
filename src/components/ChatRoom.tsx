import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRoomProps {
  onTerminate: () => void;
  initialMood: {
    name: string;
    emoji: string;
  };
}

export default function ChatRoom({ onTerminate, initialMood }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with the agent's first message
  useEffect(() => {
    const startChat = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Initial mood: ${initialMood.emoji} ${initialMood.name}`,
            isFirstMessage: true,
          }),
        });
        
        if (!response.ok) throw new Error('Failed to get initial response');
        
        const data = await response.json();
        setMessages([
          { role: 'assistant', content: data.message }
        ]);
      } catch (error) {
        console.error('Error starting chat:', error);
        setMessages([
          { role: 'assistant', content: "I'm here to help you reflect on your mood. How are you feeling right now?" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    startChat();
  }, [initialMood]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          isFirstMessage: false,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble responding right now. Could you try again?" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white/20 backdrop-blur-sm rounded-[24px] p-6 shadow-lg">
      {/* Chat header */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold text-gradient mb-2">Mood Reflection</h2>
        <p className="text-[var(--secondary-text-color)]">
          Let's talk about your {initialMood.name.toLowerCase()} mood {initialMood.emoji}
        </p>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-4 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient text-white rounded-tr-none'
                  : 'bg-white text-[var(--accent-color)] rounded-tl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block bg-white text-[var(--accent-color)] p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--primary-color)] transition-colors bg-white/50"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            !inputMessage.trim() || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient text-white hover:opacity-90 shadow-md'
          }`}
        >
          Send
        </button>
      </div>

      {/* Terminate button */}
      <button
        onClick={onTerminate}
        className="mt-4 px-6 py-3 bg-white text-[var(--accent-color)] rounded-full hover:bg-gray-50 transition-colors shadow-md font-medium"
      >
        End Session
      </button>
    </div>
  );
}