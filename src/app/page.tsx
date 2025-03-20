'use client';

import { useState, useEffect } from 'react';
import MoodForm from '@/components/MoodForm';
import ChatRoom from '@/components/ChatRoom';
import { isNotionConfigured } from '@/lib/notion';

interface MoodOption {
  id: string;
  name: string;
  emoji: string;
}

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [, setIsTransitioning] = useState(false);

  useEffect(() => {
    const init = async () => {
      await isNotionConfigured();
    };

    init();
  }, []);

  const handleMoodSubmit = (mood: MoodOption) => {
    setIsTransitioning(true);
    setSelectedMood(mood);
    setShowChat(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };
  
  const resetForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMood(null);
      setShowChat(false);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      <div className="w-full h-full md:max-w-4xl md:mx-auto px-4 mt-4">
        <div className="relative min-h-[600px]">
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
              showChat ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ pointerEvents: showChat ? 'none' : 'auto' }}
          >
            <MoodForm onMoodSubmit={handleMoodSubmit} />
          </div>
          <div 
            className={`transition-opacity duration-300 ease-in-out ${
              showChat ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              pointerEvents: showChat ? 'auto' : 'none'
            }}
          >
            {selectedMood && (
              <ChatRoom 
                initialMood={{
                  name: selectedMood.name,
                  emoji: selectedMood.emoji
                }}
                onTerminate={resetForm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
