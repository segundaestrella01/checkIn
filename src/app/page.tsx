'use client';

import { useState, useEffect } from 'react';
import Mood from '@/components/Mood';
import ChatRoom from '@/components/ChatRoom';
import { isNotionConfigured } from '@/lib/notion';

interface MoodOption {
  id: string;
  emoji: string;
  name: string;
}

const moods: MoodOption[] = [
  { id: 'angry', emoji: '😡', name: 'Angry' },
  { id: 'tired', emoji: '😴', name: 'Tired' },
  { id: 'stressed', emoji: '😰', name: 'Stressed' },
  { id: 'anxious', emoji: '😬', name: 'Anxious' },
  { id: 'calm', emoji: '😌', name: 'Calm' },
  { id: 'energetic', emoji: '⚡', name: 'Energetic' },
  { id: 'happy', emoji: '😄', name: 'Happy' }
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [todayDate, setTodayDate] = useState('');
  const [notionConfigured, setNotionConfigured] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Format today's date
      const today = new Date();
      setTodayDate(today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
      // Check if Notion is configured
      const notionStatus = await isNotionConfigured();
      setNotionConfigured(notionStatus);
    };

    init();
  }, []);

  const selectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  const submitMood = async () => {
    if (!selectedMood) return;
    setSubmitted(true);
    setShowChat(true);
  };
  
  const resetForm = () => {
    setSelectedMood(null);
    setSubmitted(false);
    setShowChat(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      <div className="w-full h-full md:max-w-4xl md:mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center md:min-h-0 backdrop-blur-sm rounded-[32px] shadow-xl">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gradient mb-3">
              How are you feeling?
            </h1>
            <p className="text-[var(--secondary-dark-text-color)] text-center text-lg">{todayDate}</p>
          </div>

          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <p className="text-xl md:text-2xl mb-3 text-[var(--text-color)]">Take a moment to reflect</p>
                <p className="text-[var(--secondary-text-color)] text-lg">
                  Select the mood that best describes your current state
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {moods.map((mood) => (
                  <Mood
                    key={mood.id}
                    emoji={mood.emoji}
                    name={mood.name}
                    selected={selectedMood?.id === mood.id}
                    onSelect={() => selectMood(mood)}
                  />
                ))}
              </div>

              <div className="text-center bottom-8 left-0 right-0 md:static">
                <button
                  className={`
                    px-12 py-4 rounded-full text-lg font-medium transition-all
                    ${selectedMood 
                      ? 'bg-gradient text-white hover:opacity-90 shadow-lg' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  onClick={submitMood}
                  disabled={!selectedMood}
                >
                  Record Mood
                </button>
                {notionConfigured && (
                  <div className="mt-4">
                    <span className="inline-block px-4 py-2 bg-[var(--secondary-color)] text-[var(--primary-color)] text-sm rounded-full">
                      Synced with Notion
                    </span>
                  </div>
                )}

              </div>
            </>
          ) : (
            <>
              {showChat && selectedMood ? (
                <ChatRoom 
                  initialMood={{
                    name: selectedMood.name,
                    emoji: selectedMood.emoji
                  }}
                  onTerminate={resetForm}
                />
              ) : (
                <div className="text-center h-[calc(100vh-200px)] md:h-auto flex flex-col justify-center items-center">
                  <div className="w-24 h-24 bg-gradient rounded-full flex items-center justify-center mb-8">
                    <span className="text-4xl">{selectedMood?.emoji}</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-gradient">Mood Recorded!</h2>
                  <p className="text-xl mb-6 text-gray-600">You are feeling {selectedMood?.name.toLowerCase()}</p>

                  <button
                    className="px-8 py-3 bg-white text-[var(--text-color)] rounded-full hover:bg-gray-50 transition-colors shadow-md mt-4"
                    onClick={resetForm}
                  >
                    Record Another Mood
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
