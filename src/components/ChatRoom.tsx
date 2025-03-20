import { useState, useRef, useEffect } from 'react';
import Toast from './Toast';

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
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to top and disable body scroll when component mounts
  useEffect(() => {
    // Force layout recalculation before scrolling
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    });
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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

  const handleEndSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Please provide a brief reflection note summarizing our conversation about my mood today.",
          isFirstMessage: false,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get final response');

      const data = await response.json();
      const finalNote = data.message;

      // Add the final exchange to the chat
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Before we end this session, let me provide a brief summary of our conversation." },
        { role: 'assistant', content: finalNote }
      ]);

      // Save to Notion with the reflection note
      handleSave();

    } catch (error) {
      console.error('Error ending session:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble saving our conversation. You can still end the session."
      }]);
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveMood',
          data: {
            mood: initialMood.name,
            emoji: initialMood.emoji,
            date: new Date().toISOString(),
            reflectionNote: messages.map(m => m.content).join('\n')
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save to Notion');
      }

      setShowToast(true);
      setTimeout(() => {
        setIsSaving(false);
        onTerminate();
      }, 3000);
    } catch (error) {
      console.error('Error saving to Notion:', error);
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex flex-col h-screen max-h-screen bg-[var(--background-color)]">
        {/* Chat header */}
        <div className="mb-2 text-center relative flex items-center justify-center pt-4">
          <div>
            <h2 className="text-2xl font-semibold text-gradient mb-1">Mood Reflection</h2>
            <p className="text-[var(--secondary-text-color)]">
              Lets talk about your {initialMood.name.toLowerCase()} mood {initialMood.emoji}
            </p>
          </div>
          <button
            onClick={handleEndSession}
            disabled={isLoading || isSaving}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/80 transition-colors ${
              (isLoading || isSaving) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="End Session"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--accent-color)]"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            {isSaving && (
              <span className="absolute right-full mr-2 whitespace-nowrap text-sm text-[var(--accent-color)]">
                Saving...
              </span>
            )}
          </button>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto mb-2 px-4">
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
                    : 'bg-white/90 text-[var(--primary-color)] rounded-tl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block bg-white/80 text-[var(--accent-color)] p-3 rounded-2xl rounded-tl-none">
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
        <div className="px-4 pb-2">
          <div className="flex gap-3 mb-2 items-center">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              rows={2}
              className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--primary-color)] transition-colors bg-white/90 resize-none min-h-[64px] max-h-[160px] overflow-y-auto text-[var(--accent-color)]"
              disabled={isLoading || isSaving}
              style={{ scrollbarWidth: 'thin' }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || isSaving}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                !inputMessage.trim() || isLoading || isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient text-white hover:opacity-90 shadow-md'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <Toast 
        message="Successfully saved your mood and reflections to Notion!"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}