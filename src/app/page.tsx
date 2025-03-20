'use client';

import { useState, useEffect } from 'react';
import MoodForm from '@/components/MoodForm';
import ChatRoom from '@/components/ChatRoom';
import { isNotionConfigured } from '@/lib/notion';

interface MoodOption {
  id: string;
  emoji: string;
  name: string;
}

export default function Home() {
  const [notionConfigured, setNotionConfigured] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);

  useEffect(() => {
    const init = async () => {
      const notionStatus = await isNotionConfigured();
      setNotionConfigured(notionStatus);
    };

    init();
  }, []);

  const handleMoodSubmit = (mood: MoodOption) => {
    setSelectedMood(mood);
    setShowChat(true);
  };
  
  const resetForm = () => {
    setSelectedMood(null);
    setShowChat(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      <div className="w-full h-full md:max-w-4xl md:mx-auto px-4 mt-4">
        {showChat && selectedMood ? (
          <ChatRoom 
            initialMood={{
              name: selectedMood.name,
              emoji: selectedMood.emoji
            }}
            onTerminate={resetForm}
          />
        ) : (
          <MoodForm onMoodSubmit={handleMoodSubmit} />
        )}
      </div>
    </div>
  );
}
